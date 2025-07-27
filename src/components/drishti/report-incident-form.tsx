
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { storage, db, auth } from "@/lib/firebase";

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
import { Input } from "@/components/ui/input";
import { type Zone, type IncidentSeverity, type IncidentType, type Incident } from "@/lib/types";

const incidentTypes = ["Medical", "Security", "Lost Item", "Technical", "Other"] as const;
const severities = ["Low", "Medium", "High", "Critical"] as const;

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
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  
  const form = useForm<ReportIncidentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Medical",
      severity: "Medium",
      location: zones.length > 0 ? zones[0].name : "",
    },
  });

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `incidents/${Date.now()}_${file.name}`);
    try {
      // Upload with metadata for public access
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'public': 'true'
        }
      };
      
      const snapshot = await uploadBytes(storageRef, file, metadata);
      console.log('Uploaded a blob or file!', snapshot);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File available at', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const saveIncidentToFirestore = async (data: ReportIncidentFormValues, imageURL?: string) => {
    try {
      // Log authentication state
      console.log("Current user:", auth.currentUser);
      console.log("Auth state:", auth.currentUser ? "authenticated" : "not authenticated");
      
      // First, try a simple test document to see if basic write works
      console.log("Testing basic Firestore write...");
      const testData = {
        test: "hello world",
        timestamp: serverTimestamp()
      };

      // Create incident data without id (Firestore will auto-generate it)
      const incidentData = {
        type: data.type,
        severity: data.severity,
        location: data.location,
        status: "New",
        timestamp: serverTimestamp(),
        assignedAgent: "",
        ...(imageURL && imageURL.trim() !== "" && { imageURL: imageURL.trim() }),
      };
      
      // Log the data being sent for debugging
      console.log("Form data received:", data);
      console.log("Sending incident data to Firestore:", incidentData);
      console.log("Image URL:", imageURL);
      
      const docRef = await addDoc(collection(db, "incidents"), incidentData);
      console.log("Incident saved with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving incident to Firestore:", error);
      console.error("Error code:", (error as any)?.code);
      console.error("Error message:", (error as any)?.message);
      console.error("Full error object:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (values: ReportIncidentFormValues) => {
    try {
      setUploading(true);
      
      let imageURL: string | undefined;
      
      // Upload image if selected
      if (selectedFile) {
        imageURL = await uploadImage(selectedFile);
      }
      
      // Save to Firestore
      await saveIncidentToFirestore(values, imageURL);
      
      // Call the original onSubmit callback
      onSubmit(values);
      
    } catch (error) {
      console.error("Error submitting incident:", error);
      // You might want to show an error message to the user here
    } finally {
      setUploading(false);
    }
  };

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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={zones.length === 0}>
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
        
        {/* Image Upload Field */}
        <div className="space-y-2">
          <FormLabel>Incident Image (Optional)</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          {selectedFile && (
            <p className="text-sm text-gray-600">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Submitting..." : "Report Incident"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
