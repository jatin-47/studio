'use server';
/**
 * @fileOverview Social media sentiment analysis AI agent.
 *
 * - analyzeSocialMediaSentiment - A function that handles the social media sentiment analysis process.
 * - AnalyzeSocialMediaSentimentInput - The input type for the analyzeSocialMediaSentiment function.
 * - AnalyzeSocialMediaSentimentOutput - The return type for the analyzeSocialMediaSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSocialMediaSentimentInputSchema = z.object({
  event: z.string().describe('The event for which to analyze social media sentiment.'),
});
export type AnalyzeSocialMediaSentimentInput = z.infer<typeof AnalyzeSocialMediaSentimentInputSchema>;

const AnalyzeSocialMediaSentimentOutputSchema = z.object({
  sentiment: z.string().describe('The overall sentiment towards the event (positive, negative, or neutral).'),
  summary: z.string().describe('A brief summary of the social media sentiment.'),
  alerts: z.array(z.string()).describe('Any potential issues or threats identified in the social media data.'),
});
export type AnalyzeSocialMediaSentimentOutput = z.infer<typeof AnalyzeSocialMediaSentimentOutputSchema>;

export async function analyzeSocialMediaSentiment(input: AnalyzeSocialMediaSentimentInput): Promise<AnalyzeSocialMediaSentimentOutput> {
  return analyzeSocialMediaSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSocialMediaSentimentPrompt',
  input: {schema: AnalyzeSocialMediaSentimentInputSchema},
  output: {schema: AnalyzeSocialMediaSentimentOutputSchema},
  prompt: `You are a social media analyst tasked with analyzing the sentiment surrounding a specific event.

  Event: {{{event}}}

  Analyze social media data related to the event and provide the following:
  - Overall sentiment (positive, negative, or neutral)
  - A brief summary of the sentiment
  - Any potential issues or threats identified in the social media data as alerts
  `,
});

const analyzeSocialMediaSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeSocialMediaSentimentFlow',
    inputSchema: AnalyzeSocialMediaSentimentInputSchema,
    outputSchema: AnalyzeSocialMediaSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
