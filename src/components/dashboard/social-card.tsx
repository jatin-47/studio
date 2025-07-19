"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  analyzeSocialMediaSentiment,
  type AnalyzeSocialMediaSentimentOutput,
} from "@/ai/flows/analyze-social-media-sentiment";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ThumbsUp, ThumbsDown, Meh, AlertCircle, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SocialCard() {
  const [event, setEvent] = useState("Starlight Music Festival 2024");
  const [sentimentData, setSentimentData] =
    useState<AnalyzeSocialMediaSentimentOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!event) {
      setError("Event name cannot be empty.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setSentimentData(null);
      const result = await analyzeSocialMediaSentiment({ event });
      setSentimentData(result);
    } catch (e) {
      setError(
        "Failed to analyze social media sentiment. Please try again later."
      );
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string = "") => {
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes("positive"))
      return <ThumbsUp className="h-6 w-6 text-green-500" />;
    if (lowerSentiment.includes("negative"))
      return <ThumbsDown className="h-6 w-6 text-red-500" />;
    return <Meh className="h-6 w-6 text-yellow-500" />;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Social Media Sentiment</CardTitle>
        <CardDescription>
          Analyze public opinion for your event.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex w-full items-center space-x-2 mb-4">
            <Input
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              placeholder="Enter event name"
            />
            <Button onClick={handleAnalysis} disabled={loading}>
              Analyze
            </Button>
          </div>

          {loading && (
            <div className="space-y-4 mt-4">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {sentimentData && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                {getSentimentIcon(sentimentData.sentiment)}
                <Badge
                  variant={
                    sentimentData.sentiment.toLowerCase() === 'positive' ? 'default' :
                    sentimentData.sentiment.toLowerCase() === 'negative' ? 'destructive' : 'secondary'
                  }
                  className="capitalize"
                >
                  {sentimentData.sentiment}
                </Badge>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground">Summary</h3>
                <p className="text-muted-foreground">{sentimentData.summary}</p>
              </div>

              {sentimentData.alerts && sentimentData.alerts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-red-500 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> Potential Issues
                  </h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                    {sentimentData.alerts.map((alert, index) => (
                      <li key={index}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        {!sentimentData && !loading && !error && (
           <div className="text-center text-muted-foreground mt-8">
            <MessageCircle className="mx-auto h-12 w-12" />
            <p className="mt-2">Enter an event name to see sentiment analysis.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
