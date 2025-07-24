"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getSmartLocation } from "@/actions/ai";
import { SmartLocationSuggestionsOutput } from "@/ai/flows/smart-location-suggestions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zones } from "@/lib/data";

const formSchema = z.object({
  currentLocation: z.string().min(1, { message: "Please select a location." }),
  currentWaitTime: z.coerce.number().min(0, { message: "Wait time must be a positive number." }),
  crowdDensity: z.enum(["low", "medium", "high"]),
});

export function SmartLocationTool() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<SmartLocationSuggestionsOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentLocation: "Zone C: Food Court",
      currentWaitTime: 25,
      crowdDensity: "high",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const alternativeLocations = zones
      .filter(zone => zone.name !== values.currentLocation)
      .map(zone => `${zone.name} (Wait Time: ${zone.waitTime} mins, Density: ${zone.crowdDensity})`);

    const response = await getSmartLocation({
      ...values,
      alternativeLocations,
    });
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({
        title: "Suggestion Generated",
        description: "AI has suggested an alternative location.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {zones.map(zone => (
                      <SelectItem key={zone.id} value={zone.name}>{zone.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentWaitTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Wait Time (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="crowdDensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crowd Density</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select density" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate Suggestion
          </Button>
        </form>
      </Form>
      {isLoading && (
         <div className="space-y-2 pt-4">
            <div className="h-4 w-1/4 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-2/3 rounded-full bg-gray-200 animate-pulse" />
         </div>
      )}
      {result && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Location Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
             <div>
                <p className="font-semibold">Suggested Location</p>
                <p className="text-muted-foreground">{result.suggestedLocation}</p>
            </div>
             <div>
                <p className="font-semibold">Reason</p>
                <p className="text-muted-foreground">{result.reason}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
