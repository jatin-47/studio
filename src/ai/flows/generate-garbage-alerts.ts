'use server';

/**
 * @fileOverview An AI agent for detecting and generating alerts for garbage overflow in specific zones.
 *
 * - generateGarbageAlerts - A function that handles the garbage overflow detection and alert generation process.
 * - GenerateGarbageAlertsInput - The input type for the generateGarbageAlerts function.
 * - GenerateGarbageAlertsOutput - The return type for the generateGarbageAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGarbageAlertsInputSchema = z.object({
  zoneId: z.string().describe('The ID of the zone to monitor for garbage overflow.'),
  cameraFeedDataUri: z
    .string()
    .describe(
      "A data URI of the camera feed for the specified zone. Must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  timestamp: z.string().describe('The timestamp of the camera feed capture.'),
});
export type GenerateGarbageAlertsInput = z.infer<typeof GenerateGarbageAlertsInputSchema>;

const GenerateGarbageAlertsOutputSchema = z.object({
  isOverflowing: z.boolean().describe('Whether or not garbage overflow is detected in the zone.'),
  alertMessage: z.string().describe('A message describing the garbage overflow situation.'),
});
export type GenerateGarbageAlertsOutput = z.infer<typeof GenerateGarbageAlertsOutputSchema>;

export async function generateGarbageAlerts(input: GenerateGarbageAlertsInput): Promise<GenerateGarbageAlertsOutput> {
  return generateGarbageAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGarbageAlertsPrompt',
  input: {schema: GenerateGarbageAlertsInputSchema},
  output: {schema: GenerateGarbageAlertsOutputSchema},
  prompt: `You are an AI-powered garbage overflow detection system.

You are monitoring zone ID {{{zoneId}}} at timestamp {{{timestamp}}}.

Analyze the following camera feed to determine if there is a garbage overflow situation. Set isOverflowing to true if there is an overflow, and false otherwise.

Camera Feed: {{media url=cameraFeedDataUri}}

If there is an overflow, generate an alert message describing the situation, including the zone ID and timestamp.

Respond in JSON format.`,
});

const generateGarbageAlertsFlow = ai.defineFlow(
  {
    name: 'generateGarbageAlertsFlow',
    inputSchema: GenerateGarbageAlertsInputSchema,
    outputSchema: GenerateGarbageAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
