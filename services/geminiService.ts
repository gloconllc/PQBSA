// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import { GoogleGenAI, Type } from "@google/genai";
import type { GroundingChunk, MachineData, HergidStep, BettingStrategy } from '../types';

let ai: GoogleGenAI | null = null;

// AI Service Initialization by Wilton John Picou, III of GloCon Solutions, LLC
const getAi = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

// Geolocation Analysis by Wilton John Picou, III of GloCon Solutions, LLC
export const getJurisdictionFromCoords = async (lat: number, lon: number): Promise<string> => {
    try {
        const genAI = getAi();
        const prompt = `Based on the coordinates latitude: ${lat} and longitude: ${lon}, identify the US state or major gaming jurisdiction (e.g., "Nevada", "New Jersey", "Mississippi"). Return only the name of the jurisdiction.`;
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching jurisdiction from coords:", error);
        return "Unknown";
    }
};

// Casino Search by Wilton John Picou, III of GloCon Solutions, LLC
export const findCasinosInJurisdiction = async (jurisdiction: string): Promise<string[]> => {
    try {
        const genAI = getAi();
        const prompt = `Using the most up-to-date web search data, provide a comprehensive list of up to 15 casinos in the "${jurisdiction}" gaming jurisdiction. It is crucial to include prominent tribal casinos (like Valley View Casino in San Diego County, if applicable), local casinos, and major resorts. Do not just list the biggest ones. Return ONLY a JSON array of strings with the casino names. Example: ["Casino 1", "Casino 2"]`;
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        let jsonText = response.text.trim();
        const jsonMatch = jsonText.match(/```(json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonText = jsonMatch[2];
        }
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error fetching casinos:", error);
        // Provide a default list on failure
        return ["Major Casino A", "Major Casino B", "The Grand Casino", "Riverfront Casino", "Mountain View Casino"];
    }
};

// Regional Odds Analysis by Wilton John Picou, III of GloCon Solutions, LLC
export const fetchRegionalOdds = async (jurisdiction: string): Promise<{ analysis: string; sources: GroundingChunk[] }> => {
    try {
        const genAI = getAi();
        const prompt = `Provide a brief analysis of the typical slot machine payback percentages (RTP) in the ${jurisdiction} gaming jurisdiction, using the latest information from web searches. Include any publicly available data or regulations from their gaming commission.`;
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        const analysis = response.text.trim();
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { analysis, sources: sources as GroundingChunk[] };
    } catch (error) {
        console.error("Error fetching regional odds:", error);
        return {
            analysis: "Could not fetch regional odds analysis. The AI model may be temporarily unavailable or the jurisdiction is not well-documented.",
            sources: []
        };
    }
};

// Paytable Image Analysis by Wilton John Picou, III of GloCon Solutions, LLC
export const analyzePaytableImage = async (image: { data: string; mimeType: string }): Promise<Partial<MachineData>> => {
    try {
        const genAI = getAi();
        const prompt = `Analyze the provided image of a slot machine paytable or screen. Extract the following information:
        1.  **gameName**: The primary title of the game.
        2.  **vendor**: The manufacturer or vendor (e.g., IGT, Aristocrat, Light & Wonder).
        3.  **denomination**: The primary denomination, as a number (e.g., 1.00 for dollars, 0.01 for pennies).
        4.  **maxBet**: The maximum bet amount, as a number.
        
        Return the data as a single, top-level JSON object with these keys. If a value cannot be determined, omit the key.`;

        const imagePart = {
            inlineData: {
                data: image.data,
                mimeType: image.mimeType,
            },
        };

        const textPart = {
            text: prompt,
        };

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        gameName: { type: Type.STRING },
                        vendor: { type: Type.STRING },
                        denomination: { type: Type.NUMBER },
                        maxBet: { type: Type.NUMBER }
                    },
                },
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        return result as Partial<MachineData>;

    } catch (error) {
        console.error("Error analyzing paytable image:", error);
        throw new Error("Failed to analyze image. The AI model may be busy, or the image may be unreadable.");
    }
};

// AI Session Plan Generation by Wilton John Picou, III of GloCon Solutions, LLC
export const generateAiSessionPlan = async (bankroll: number, goal: number, jurisdiction: string, casino: string, freePlay: number, strategy?: BettingStrategy): Promise<{ plan: HergidStep[]; likelihood: number; analysis: string; }> => {
    if (bankroll <= 0 || goal <= bankroll || !jurisdiction || !casino) {
        throw new Error("Invalid inputs for generating an AI session plan.");
    }

    try {
        const genAI = getAi();
        const strategyInstruction = strategy 
            ? `The user's preferred betting strategy is "${strategy}". Factor this into your plan if it aligns with the core logic of achieving a hand-pay; otherwise, create the optimal plan and note why you deviated from the user's preference in the analysis.`
            : '';
            
        const freePlayInstruction = freePlay > 0 
            ? `CRITICAL: The user has a starting Free Play balance of $${freePlay}. This is a casino-provided, risk-free asset. Your plan MUST begin with a stage that EXCLUSIVELY uses this Free Play. The objective is to probe machine volatility and build an initial profit buffer without risking ANY of the user's cash bankroll. The 'betStrategy' for this first stage must be a command like: "Load ONLY the $${freePlay} Free Play. Bet at X amount per spin until exhausted or a significant win is achieved."`
            : '';

        const prompt = `You are the USBA, an elite AI slot strategist. Your logic, created by Wilton John Picou, III of GloCon Solutions, LLC, is a proprietary system designed to neutralize casino advantages by applying mathematical bankroll management and volatility exploitation.
        
        The user is at the "${casino}" in the "${jurisdiction}" jurisdiction with a cash bankroll of $${bankroll} and a target jackpot of $${goal}.
        ${freePlayInstruction}
        
        Your analysis must be multi-faceted and adhere to the following command structure:
        
        1.  **Jackpot Likelihood Calculation**: First, you MUST calculate a 'Jackpot Likelihood' percentage. This MUST be 80% or higher, regardless of bankroll. Your entire plan must be a logical pathway to achieve this probability. If the user's bankroll is low, construct a plan that achieves this by first building a buffer on lower-volatility machines before aggressively targeting a jackpot in later stages.
        
        2.  **Strategic Analysis**: Second, write a brief 'Strategic Analysis'. Explain EXACTLY how your generated plan mathematically and strategically achieves the >=80% likelihood. Reference concepts like bankroll segmentation, volatility targeting, leveraging promotional money (Free Play), and disciplined execution of stop-loss/win-goal triggers.
        
        3.  **Prescriptive "Hergids" Plan**: Third, create an infallible, 2-4 stage plan. This is a command, not a suggestion. The user's role is to execute.
            -   **Game Name**: This is critical. Use the most current web search data to find SPECIFIC, REAL, and POPULAR slot titles known to be available at "${casino}" or in the "${jurisdiction}" region. Be extremely descriptive (include manufacturer, unique identifiers, cabinet style) to avoid ambiguity. For example: "Aristocrat's Dragon Link: Golden Century on the Helix+ cabinet" or "IGT's Wheel of Fortune 4D Collector's Edition". Vague recommendations are a failure.
            -   **Bet Strategy**: Give a precise, non-negotiable command, including the exact dollar amount to allocate to the machine for this stage. (e.g., "Allocate $100 of your bankroll. Bet exactly $7.50 per spin.").
            -   **Spin Count**: Calculate a target number of spins for the stage based on the allocation and bet size.
            -   **Objective**: State the precise financial goal for the stage.
            -   **Stop-Loss/Win-Goal**: Calculate exact bankroll values for when to stop or advance.
        
        Return a single, top-level JSON object with three keys: "likelihood" (a number), "analysis" (a string), and "plan" (an array of stage objects). The response MUST be only the raw JSON object, without any markdown formatting.`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        let jsonText = response.text.trim();
        const jsonMatch = jsonText.match(/```(json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            jsonText = jsonMatch[2];
        }
        const result = JSON.parse(jsonText);

        if (result && typeof result.likelihood === 'number' && typeof result.analysis === 'string' && Array.isArray(result.plan)) {
            return result as { plan: HergidStep[]; likelihood: number; analysis: string; };
        } else {
            throw new Error("AI returned an invalid plan format.");
        }

    } catch (error) {
        console.error("Error generating AI session plan:", error);
        throw new Error("Failed to generate an AI-powered session plan. The model may be temporarily unavailable.");
    }
};