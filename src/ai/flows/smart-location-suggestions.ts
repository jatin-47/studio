'use server';

/**
 * @fileOverview An AI agent that provides smart location suggestions for alternative zones with shorter wait times.
 *
 * - smartLocationSuggestions - A function that suggests alternative locations based on current wait times and crowd density.
 * - SmartLocationSuggestionsInput - The input type for the smartLocationSuggestions function.
 * - SmartLocationSuggestionsOutput - The return type for the smartLocationSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartLocationSuggestionsInputSchema = z.object({
  currentLocation: z.string().describe('The current location of the attendee.'),
  currentWaitTime: z.number().describe('The current wait time at the current location in minutes.'),
  crowdDensity: z.string().describe('The crowd density at the current location (e.g., low, medium, high).'),
  alternativeLocations: z
    .array(z.string())
    .describe('A list of alternative locations available to the attendee.'),
});
export type SmartLocationSuggestionsInput = z.infer<typeof SmartLocationSuggestionsInputSchema>;

const SmartLocationSuggestionsOutputSchema = z.object({
  suggestedLocation: z.string().describe('The suggested alternative location with shorter wait times.'),
  reason: z.string().describe('The reason for suggesting the alternative location.'),
});
export type SmartLocationSuggestionsOutput = z.infer<typeof SmartLocationSuggestionsOutputSchema>;

export async function smartLocationSuggestions(input: SmartLocationSuggestionsInput): Promise<SmartLocationSuggestionsOutput> {
  return smartLocationSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartLocationSuggestionsPrompt',
  input: {schema: SmartLocationSuggestionsInputSchema},
  output: {schema: SmartLocationSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping attendees find alternative locations with shorter wait times.

  Current Location: {{{currentLocation}}}
  Current Wait Time: {{{currentWaitTime}}} minutes
  Crowd Density: {{{crowdDensity}}}
  Alternative Locations: {{#each alternativeLocations}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Based on the current conditions and available alternative locations, suggest the best alternative location for the attendee and explain the reason for your suggestion.
  Consider wait times, crowd density, and proximity to the current location when making your suggestion.
`,
});

const smartLocationSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartLocationSuggestionsFlow',
    inputSchema: SmartLocationSuggestionsInputSchema,
    outputSchema: SmartLocationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
