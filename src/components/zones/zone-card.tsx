"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  generateGarbageAlerts,
  type GenerateGarbageAlertsOutput,
} from "@/ai/flows/generate-garbage-alerts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Trash2, Loader2 } from "lucide-react";

type ZoneCardProps = {
  zoneId: string;
  zoneName: string;
  imageSrc: string;
  imageHint: string;
};

// A small 1x1 transparent gif to send to the AI flow
const DUMMY_IMAGE_DATA_URI = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';


export function ZoneCard({ zoneId, zoneName, imageSrc, imageHint }: ZoneCardProps) {
  const [analysisResult, setAnalysisResult] =
    useState<GenerateGarbageAlertsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);

      const result = await generateGarbageAlerts({
        zoneId: zoneId,
        cameraFeedDataUri: DUMMY_IMAGE_DATA_URI,
        timestamp: new Date().toISOString(),
      });
      // For demonstration, we randomize the result
      const randomResult = {
        ...result,
        isOverflowing: Math.random() > 0.5,
      };
      if(randomResult.isOverflowing){
        randomResult.alertMessage = `Garbage overflow detected in ${zoneName}. Immediate attention required.`
      }

      setAnalysisResult(randomResult);
    } catch (e) {
      setError("Failed to analyze zone. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{zoneName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="aspect-video relative overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={`Camera feed for ${zoneName}`}
            fill
            className="object-cover"
            data-ai-hint={imageHint}
          />
        </div>
        {analysisResult && (
          <Alert variant={analysisResult.isOverflowing ? "destructive" : "default"}>
            {analysisResult.isOverflowing ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertTitle>
              {analysisResult.isOverflowing ? "Overflow Detected!" : "All Clear"}
            </AlertTitle>
            <AlertDescription>
              {analysisResult.isOverflowing
                ? analysisResult.alertMessage
                : "No garbage overflow detected."}
            </AlertDescription>
          </Alert>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="mr-2 h-4 w-4" />
          )}
          Analyze Garbage
        </Button>
      </CardFooter>
    </Card>
  );
}
