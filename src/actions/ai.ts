"use server";

import {
  analyzeIncidentAndSuggestRouting,
  IncidentRoutingInput,
} from "@/ai/flows/incident-routing";
import {
  smartLocationSuggestions,
  SmartLocationSuggestionsInput,
} from "@/ai/flows/smart-location-suggestions";

export async function getIncidentRoute(data: IncidentRoutingInput) {
  try {
    const result = await analyzeIncidentAndSuggestRouting(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get incident route." };
  }
}

export async function getSmartLocation(data: SmartLocationSuggestionsInput) {
  try {
    const result = await smartLocationSuggestions(data);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get smart location." };
  }
}
