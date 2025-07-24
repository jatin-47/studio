
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { getIncidentRoute } from "@/actions/ai";
import { IncidentRoutingOutput } from "@/ai/flows/incident-routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2, Route, User, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  incidentReport: z.string().min(10, {
    message: "Incident report must be at least 10 characters.",
  }),
  availableAgents: z.string().min(1, {
    message: "Please list available agents, separated by commas.",
  }),
});

export function IncidentRoutingTool() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<IncidentRoutingOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentReport: "A brawl has broken out near the main stage in Zone A. Multiple individuals involved, appears to be escalating.",
      availableAgents: "Agent Smith (Zone A, Sector 2), Agent Jones (Zone B, Sector 1), Agent Brown (Central Hub)",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const agentList = values.availableAgents.split(',').map(agent => agent.trim());

    const response = await getIncidentRoute({ 
      incidentReport: values.incidentReport,
      availableAgents: agentList
    });

    if (response.success && response.data) {
        setResult(response.data);
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: response.error || "Failed to get incident route.",
        });
    }
    
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="incidentReport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incident Report</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the incident in detail..."
                    className="h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableAgents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Agents</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Agent Smith (Zone A), Agent Jones (Zone B)" {...field} />
                </FormControl>
                <FormDescription>
                    Enter a comma-separated list of available agents and their locations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                </>
            ) : (
                <>
                    <Bot className="mr-2 h-4 w-4" /> Get Routing Suggestion
                </>
            )}
          </Button>
        </form>
      </Form>
      {result && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" /> AI Suggestion
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-1"/>
                    <div>
                        <p className="font-semibold">Assigned Agent</p>
                        <p>{result.assignedAgent}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-1"/>
                    <div>
                        <p className="font-semibold">Estimated Response Time</p>
                        <p>{result.estimatedResponseTime}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Route className="h-5 w-5 text-muted-foreground mt-1"/>
                    <div>
                        <p className="font-semibold">Suggested Route</p>
                        <p className="text-muted-foreground">{result.suggestedRoute}</p>
                    </div>
                </div>
                {result.additionalNotes && (
                     <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="font-semibold">Additional Notes</p>
                            <p className="text-muted-foreground">{result.additionalNotes}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
