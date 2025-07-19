"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  provideWeatherInsights,
  type WeatherInsightsOutput,
} from "@/ai/flows/provide-weather-insights";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Sun, Cloud, Snowflake, Zap, AlertCircle } from "lucide-react";

export function WeatherCard() {
  const [weatherData, setWeatherData] = useState<WeatherInsightsOutput | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);
        const insights = await provideWeatherInsights();
        setWeatherData(insights);
      } catch (e) {
        setError("Failed to fetch weather insights. Please try again later.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  const getWeatherIcon = (summary: string = "") => {
    const lowerSummary = summary.toLowerCase();
    if (lowerSummary.includes("snow") || lowerSummary.includes("frost"))
      return <Snowflake className="h-6 w-6 text-accent" />;
    if (lowerSummary.includes("storm") || lowerSummary.includes("thunder"))
      return <Zap className="h-6 w-6 text-accent" />;
    if (lowerSummary.includes("cloud") || lowerSummary.includes("overcast"))
      return <Cloud className="h-6 w-6 text-accent" />;
    if (lowerSummary.includes("sun") || lowerSummary.includes("clear"))
      return <Sun className="h-6 w-6 text-accent" />;
    return <Cloud className="h-6 w-6 text-accent" />;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Weather Insights</CardTitle>
            <CardDescription>AI-powered forecast and advice</CardDescription>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            weatherData && getWeatherIcon(weatherData.summary)
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          weatherData && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">Summary</h3>
                <p className="text-muted-foreground">{weatherData.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Recommendations
                </h3>
                <p className="text-muted-foreground">
                  {weatherData.recommendations}
                </p>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
