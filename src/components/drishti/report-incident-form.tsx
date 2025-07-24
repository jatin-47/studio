
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Zone, type IncidentSeverity, type IncidentType } from "@/lib/types";

const incidentTypes: IncidentType[] = ["Medical", "Security", "Lost Item", "Technical", "Other"];
const severities: IncidentSeverity[] = ["Low", "Medium", "High", "Critical"];

const formSchema = z.object({
  type: z.enum(incidentTypes, { required_error: "Incident type is required." }),
  severity: z.enum(severities, { required_error: "Severity is required." }),
  location: z.string().min(1, { message: "Please select a location." }),
});

type ReportIncidentFormValues = z.infer<typeof formSchema>;

interface ReportIncidentFormProps {
  zones: Zone[];
  onSubmit: (data: ReportIncidentFormValues) => void;
  onClose: () => void;
}

export function ReportIncidentForm({ zones, onSubmit, onClose }: ReportIncidentFormProps) {
  const form = useForm<ReportIncidentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Medical",
      severity: "Medium",
      location: zones.length > 0 ? zones[0].name : "",
    },
  });

  function handleFormSubmit(values: ReportIncidentFormValues) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select incident type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {severities.map((severity) => (
                    <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.name}>{zone.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Report Incident</Button>
        </div>
      </form>
    </Form>
  );
}
