'use server';

/**
 * @fileOverview Incident routing AI agent tool.
 *
 * - analyzeIncidentAndSuggestRouting - A function that analyzes incident reports and suggests optimal routing decisions.
 * - IncidentRoutingInput - The input type for the analyzeIncidentAndSuggestRouting function.
 * - IncidentRoutingOutput - The return type for the analyzeIncidentAndSuggestRouting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IncidentRoutingInputSchema = z.object({
  incidentReport: z.string().describe('The detailed incident report, including location, type of incident, and severity.'),
  availableAgents: z.array(z.string()).describe('A list of available security personnel or agents with their current locations.'),
  zoneMap: z.string().optional().describe('A description of the zone map, including zone boundaries, crowd density, and known hazards.  If possible, include a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
});
export type IncidentRoutingInput = z.infer<typeof IncidentRoutingInputSchema>;

const IncidentRoutingOutputSchema = z.object({
  suggestedRoute: z.string().describe('The suggested route for the assigned agent, taking into account the incident details and zone conditions.'),
  assignedAgent: z.string().describe('The agent best suited to respond to the incident.'),
  estimatedResponseTime: z.string().describe('The estimated time for the agent to arrive at the incident location.'),
  additionalNotes: z.string().optional().describe('Any additional notes or recommendations for the agent.'),
});
export type IncidentRoutingOutput = z.infer<typeof IncidentRoutingOutputSchema>;

export async function analyzeIncidentAndSuggestRouting(input: IncidentRoutingInput): Promise<IncidentRoutingOutput> {
  return incidentRoutingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'incidentRoutingPrompt',
  input: {schema: IncidentRoutingInputSchema},
  output: {schema: IncidentRoutingOutputSchema},
  prompt: `You are an AI assistant designed to analyze incident reports and suggest optimal routing decisions for security personnel.\n\n  Analyze the incident report, available agents, and zone map information provided to determine the best course of action.\n\n  Incident Report: {{{incidentReport}}}\n  Available Agents: {{#each availableAgents}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}\n  Zone Map: {{#if zoneMap}}{{media url=zoneMap}}{{else}}No zone map provided.{{/if}}\n\n  Based on this information, determine the most suitable agent to respond, the optimal route, and the estimated response time.\n  Return your answer in JSON format according to the schema.\n  Include any additional notes or recommendations that could assist the agent.\n  Make sure the \"suggestedRoute\" is very detailed.\n  `,
});

const incidentRoutingFlow = ai.defineFlow(
  {
    name: 'incidentRoutingFlow',
    inputSchema: IncidentRoutingInputSchema,
    outputSchema: IncidentRoutingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
