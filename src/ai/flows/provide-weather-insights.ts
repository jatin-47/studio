'use server';

/**
 * @fileOverview This file defines a Genkit flow to provide AI insights on weather conditions.
 *
 * The flow takes no input and returns weather insights to help event managers prepare for weather-related challenges.
 * It uses a prompt to generate the insights.
 *
 * @exports provideWeatherInsights - An async function that triggers the weather insights flow.
 * @exports WeatherInsightsOutput - The output type for the provideWeatherInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherInsightsOutputSchema = z.object({
  summary: z.string().describe('A summary of the current weather conditions.'),
  recommendations: z.string().describe('Recommendations for event managers based on the weather conditions.'),
});
export type WeatherInsightsOutput = z.infer<typeof WeatherInsightsOutputSchema>;

export async function provideWeatherInsights(): Promise<WeatherInsightsOutput> {
  return provideWeatherInsightsFlow();
}

const prompt = ai.definePrompt({
  name: 'weatherInsightsPrompt',
  prompt: `You are an AI assistant providing weather insights for event managers.
  Provide a summary of the current weather conditions and recommendations for event managers to prepare for weather-related challenges.
  Consider factors like temperature, precipitation, wind speed, and any potential hazards.
  Format the output as a JSON object with 'summary' and 'recommendations' fields.`, 
  output: {schema: WeatherInsightsOutputSchema},
});

const provideWeatherInsightsFlow = ai.defineFlow(
  {
    name: 'provideWeatherInsightsFlow',
    inputSchema: z.void(),
    outputSchema: WeatherInsightsOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
