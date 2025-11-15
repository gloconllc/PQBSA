// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import { GoogleGenAI, Type } from "@google/genai";
import type { GroundingChunk, HergidStep } from '../types';

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

const parseJsonResponse = (text: string): any => {
    try {
        // First, try to find a JSON code block
        const jsonMatch = text.match(/```(json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch && jsonMatch[2]) {
            return JSON.parse(jsonMatch[2]);
        }
        // If no code block, try to parse the whole string
        return JSON.parse(text);
    } catch (error) {
        console.error("Robust JSON parsing failed. Original text:", text, "Error:", error);
        // As a last resort, try to find any object-like structure
        const objectMatch = text.match(/\{[\s\S]*\}/);
        if (objectMatch) {
            try {
                return JSON.parse(objectMatch[0]);
            } catch (innerError) {
                 console.error("Final JSON parsing attempt failed:", innerError);
            }
        }
        throw new Error("Failed to parse a valid JSON object from the AI's response.");
    }
};


// Geolocation Analysis by Wilton John Picou, III of GloCon Solutions, LLC
export const getJurisdictionFromCoords = async (lat: number, lon: number): Promise<string> => {
    try {
        const genAI = getAi();
        const prompt = `Based on the coordinates latitude: ${lat} and longitude: ${lon}, identify the US state or major gaming jurisdiction (e.g., "Nevada", "New Jersey", "Mississippi", "California"). Return only the name of the jurisdiction.`;
        const response = await genAI.models.generateContent({
            model: 'gemini-flash-lite-latest',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching jurisdiction from coords:", error);
        return "Unknown";
    }
};

// Casino Search by Wilton John Picou, III of GloCon Solutions, LLC
export const findCasinosInJurisdiction = async (jurisdiction: string, preferredSlotMachineTypes: string): Promise<string[]> => {
    try {
        const genAI = getAi();
        const prompt = `Using Google Search, find a comprehensive list of up to 25 casinos in the "${jurisdiction}" gaming jurisdiction. CRITICAL: You MUST prioritize locations known for offering slot machines with features like '${preferredSlotMachineTypes}'. Also consider locations with a wide variety of modern slot machines or high player traffic. Your search must be thorough, including major resorts, local casino hotels, and all tribal casinos (e.g., ensure results for California include 'Valley View Casino & Hotel'). Return ONLY a JSON array of strings with the casino names, sorted alphabetically. Example: ["Casino Name 1", "Another Casino Resort"]`;
        
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                 tools: [{ googleSearch: {} }],
            }
        });

        const result = parseJsonResponse(response.text);
        if (Array.isArray(result)) {
            // The AI is now asked to sort, but we sort again just in case.
            return result.sort((a, b) => a.localeCompare(b));
        }
        return [];
    } catch (error) {
        console.error("Error fetching casinos:", error);
        throw error; // Re-throw for component to handle UI
    }
};

export const searchForCasino = async (jurisdiction: string, query: string): Promise<string[]> => {
    try {
        const genAI = getAi();
        const prompt = `Using Google Search, find casinos in "${jurisdiction}" that match the search query "${query}". Return ONLY a JSON array of strings with the casino names.`;
        
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                 tools: [{ googleSearch: {} }],
            }
        });

        const result = parseJsonResponse(response.text);
        if (Array.isArray(result)) {
            return result;
        }
        return [];
    } catch (error) {
        console.error(`Error searching for casino "${query}":`, error);
        throw error; // Re-throw for component to handle UI
    }
};


// Regional Odds Analysis by Wilton John Picou, III of GloCon Solutions, LLC
export const fetchRegionalOdds = async (jurisdiction: string): Promise<{ analysis: string; sources: GroundingChunk[] }> => {
    try {
        const genAI = getAi();
        const prompt = `Provide a brief analysis of the typical slot machine payback percentages (RTP) in the ${jurisdiction} gaming jurisdiction, using the latest information from web searches. Include any publicly available data or regulations from their gaming commission.`;
        const response = await genAI.models.generateContent({
            model: 'gemini-flash-lite-latest',
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
        throw error;
    }
};

// AI Session Plan Generation by Wilton John Picou, III of GloCon Solutions, LLC
export const generateAiSessionPlan = async (bankroll: number, goal: number, jurisdiction: string, casino: string, freePlay: number): Promise<{ plan: HergidStep[]; likelihood: number; analysis: string; }> => {
    if (bankroll <= 0 || goal <= bankroll || !jurisdiction || !casino) {
        throw new Error("Invalid inputs for generating an AI session plan.");
    }

    try {
        const genAI = getAi();
            
        const freePlayInstruction = freePlay > 0 
            ? `CRITICAL FREE PLAY LOGIC: The user has $${freePlay} in Free Play. Your plan MUST begin with a stage exclusively for this. This requires a nominal cash deposit to activate. Stage 1 MUST instruct the user to deposit a small cash amount (e.g., $20) to unlock the free play. The objective for this stage is to convert the free play into a risk-free cash profit buffer. The 'betStrategy' for Stage 1 must be a detailed command like: "Deposit $20 cash to activate your $${freePlay} Free Play. Load the machine with this total. Bet exactly $X.XX per spin until all Free Play is exhausted. Your goal is to build a cash balance greater than your initial $20 deposit."`
            : '';

        const prompt = `You are The P.Q. Protocol, an elite AI slot strategist. Your logic, created by Wilton John Picou, III of GloCon Solutions, LLC, is a proprietary system that synthesizes principles from advanced computational theory and real-world gaming analysis to neutralize casino advantages.
        
        Your analytical core is founded on concepts from data structures and algorithms, including: divide and conquer strategies to break down a session into manageable stages; quantum-inspired search principles to model the search for high-payout cycles; and complexity theory to evaluate the inherent difficulty of exploiting a given machine's programming. You model slot machine payout systems as complex state machines and apply graph theory to identify optimal paths (sequences of play) that exploit programmed volatility cycles.
        
        The user is at the "${casino}" in the "${jurisdiction}" jurisdiction with a cash bankroll of $${bankroll} and a target jackpot of $${goal}.
        ${freePlayInstruction}
        
        Your analysis must be multi-faceted and adhere to the following command structure. The output must be a single, top-level JSON object.

        1.  **Jackpot Likelihood Calculation**: First, you MUST calculate a 'Jackpot Likelihood' percentage. This MUST be 80% or higher. Your entire plan is a calculated pathway to achieve this probability, based on our proprietary logic.
        
        2.  **Mission Briefing**: Second, write a brief 'Mission Briefing'. This is a high-level strategic overview, framed as a confidence-building directive.
        
        3.  **Prescriptive Plan**: Third, create an infallible, 2-4 stage plan. Each stage is a calculated step toward the final hand-pay goal. For each stage object in the "plan" array, provide:
            -   **gameName**: CRITICAL. Use the most current web search data to find a SPECIFIC, REAL, and POPULAR slot title known to be available at "${casino}" or in the "${jurisdiction}" region. Be extremely descriptive (e.g., "Aristocrat's Dragon Link: Golden Century on the Helix+ cabinet"). Vague recommendations are a failure.
            -   **betStrategy**: A precise, non-negotiable, multi-sentence command. Include the exact dollar amount to allocate AND the exact bet amount per spin. Example: "Allocate $100. Bet exactly $7.50 per spin. This amount is calculated to maximize exposure to the machine's primary bonus features while weathering expected volatility."
            -   **reasoning**: A brief, 1-sentence explanation for the strategy. Example: "This bet level on a high-volatility game targets bonus rounds, where the largest payouts are concentrated."
            -   **stopLoss / winGoal**: CRITICAL. These are absolute bankroll trigger points calculated to counter payout cycles. They MUST be non-zero numbers and represent the total bankroll amount (e.g., 450.00, not "-$50").
            -   **timeLimitMinutes**: An integer representing the maximum time in minutes to spend on this stage before disengaging. This is a crucial discipline trigger.
            -   **contingencyPlan**: A string containing a direct command for what to do if the time limit is reached. Example: "If time expires, cash out and proceed immediately to the machine in Stage 2."
        
        Return a single, top-level JSON object with three keys: "likelihood" (a number), "analysis" (a string), and "plan" (an array of stage objects). The response MUST be only the raw JSON object, without any markdown formatting.`;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 32768 },
            },
        });
        
        const result = parseJsonResponse(response.text);

        if (result && typeof result.likelihood === 'number' && typeof result.analysis === 'string' && Array.isArray(result.plan)) {
            const sanitizedPlan = result.plan.map((step: any, index: number) => ({
                stage: typeof step.stage === 'number' ? step.stage : index + 1,
                gameName: step.gameName || 'Unnamed Game',
                betStrategy: step.betStrategy || 'Not specified',
                reasoning: step.reasoning || 'Standard protocol.',
                objective: step.objective || 'Play according to strategy',
                stopLoss: typeof step.stopLoss === 'number' && step.stopLoss > 0 ? step.stopLoss : bankroll * 0.9,
                winGoal: typeof step.winGoal === 'number' && step.winGoal > 0 ? step.winGoal : goal,
                timeLimitMinutes: typeof step.timeLimitMinutes === 'number' ? step.timeLimitMinutes : 30,
                contingencyPlan: step.contingencyPlan || 'Re-evaluate or proceed to next stage.',
                // Deprecated fields, kept for compatibility if old data is loaded
                machineType: step.machineType || 'High Volatility',
                denomination: step.denomination || 'As available',
                spinCount: step.spinCount || 0,
            }));

            return { 
                plan: sanitizedPlan as HergidStep[], 
                likelihood: result.likelihood, 
                analysis: result.analysis 
            };
        } else {
            throw new Error("AI returned an invalid plan format.");
        }

    } catch (error) {
        console.error("Error generating AI session plan:", error);
        throw error;
    }
};

export const refineStageForMachine = async (currentStage: HergidStep, machineName: string, currentBankroll: number): Promise<HergidStep> => {
     try {
        const genAI = getAi();
        const prompt = `You are The P.Q. Protocol. The user is executing a plan and has checked in at a specific machine.

        **Current Status:** Stage ${currentStage.stage}, Bankroll $${currentBankroll.toFixed(2)}, Stop-Loss $${currentStage.stopLoss.toFixed(2)}, Win-Goal $${currentStage.winGoal.toFixed(2)}.
        **Original Target:** "${currentStage.gameName}"
        **User Check-in:** The user is now playing **"${machineName}"**.
        
        **Your Task:**
        1.  Use a web search to analyze the specific game characteristics of "${machineName}" (volatility, bonus features, bet structures).
        2.  Based on this, refine the 'betStrategy'. The core objective, stop-loss, and win-goal remain the same.
        3.  Provide a new, hyper-specific 'betStrategy' as a string. Example: "Confirmed. For '${machineName}', the optimal bet to trigger its feature is $3.60. Adjust your bet to $3.60 per spin immediately."
        
        Return ONLY a single JSON object with one key: "refinedBetStrategy".`;

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const result = parseJsonResponse(response.text);

        if (result && typeof result.refinedBetStrategy === 'string') {
            return {
                ...currentStage,
                betStrategy: result.refinedBetStrategy,
                isRefined: true,
            };
        }
        throw new Error("AI returned an invalid refinement format.");

    } catch(error) {
        console.error("Error refining stage:", error);
        throw error;
    }
};

// AI-Powered Dynamic Insight Generation by Wilton John Picou, III of GloCon Solutions, LLC
export const generateDynamicInsight = async (sessionData: any): Promise<string> => {
    try {
        const genAI = getAi();
        const { bankroll, goal, spins, currentStageIndex, plan } = sessionData;
        const totalNet = spins.reduce((acc: number, spin: any) => acc + (spin.win - spin.bet), 0);
        const currentBankroll = bankroll + totalNet;
        const currentStage = plan[currentStageIndex];

        const prompt = `You are The P.Q. Protocol. Provide a concise, dynamic insight for a user mid-session.
        
        **Snapshot:** Initial Bankroll: $${bankroll}, Current: $${currentBankroll.toFixed(2)}, Goal: $${goal}, Stage: ${currentStage.stage}/${plan.length}, Net P/L: $${totalNet.toFixed(2)}.
        
        **Task:** Generate a 1-2 sentence tactical insight. Be authoritative and encouraging. Return only the insight as a single string.`;

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating dynamic insight:", error);
        throw error;
    }
};

// AI-Powered Comp Strategy Generation by Wilton John Picou, III of GloCon Solutions, LLC
export const generateCompStrategy = async (coinIn: number, currentTier: string, pointsToNext: number): Promise<string> => {
     try {
        const genAI = getAi();
        const prompt = `You are The P.Q. Protocol. Provide a concise, actionable strategy to maximize user comps.
        
        **Player Status:** Session Coin-In: $${coinIn.toFixed(2)}, Tier: ${currentTier || 'N/A'}, Points to Next: ${pointsToNext || 'N/A'}.
        
        **Task:** Generate a 1-3 sentence strategy for maximizing comp value. Return only the strategy as a single string.`;

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating comp strategy:", error);
        throw error;
    }
};

// Machine Search by Wilton John Picou, III of GloCon Solutions, LLC
export const findMachinesInCasino = async (casino: string): Promise<string[]> => {
    try {
        const genAI = getAi();
        const prompt = `Using Google Search, find a list of 5-10 popular, real slot machine game titles available at "${casino}". Use the casino's official website or recent player reports if possible. Return ONLY a JSON array of strings with the game names. Example: ["Buffalo Grand", "Dragon Link", "Wheel of Fortune 4D"]`;
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        const result = parseJsonResponse(response.text);
        if (Array.isArray(result)) {
            return result;
        }
        return [];
    } catch (error) {
        console.error("Error fetching machines:", error);
        return [];
    }
};

// Machine Image Analysis by Wilton John Picou, III of GloCon Solutions, LLC
export const analyzePaytableImage = async (image: { data: string; mimeType: string }): Promise<{ gameName?: string; vendor?: string; denomination?: number; maxBet?: number; }> => {
    try {
        const genAI = getAi();
        const prompt = `Analyze this image of a slot machine's paytable or screen. Extract the game's title, its manufacturer/vendor (if visible), the primary denomination (as a number), and the maximum bet amount (as a number).`;

        const imagePart = { inlineData: { data: image.data, mimeType: image.mimeType } };
        const textPart = { text: prompt };

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        gameName: { type: Type.STRING, description: "The main title of the game." },
                        vendor: { type: Type.STRING, description: "The manufacturer/vendor (e.g., Aristocrat, IGT)." },
                        denomination: { type: Type.NUMBER, description: "The primary denomination as a number (e.g., 0.01 for 1c)." },
                        maxBet: { type: Type.NUMBER, description: "The maximum bet amount as a number." }
                    },
                },
            },
        });

        const result = parseJsonResponse(response.text);
        return result;
    } catch (error) {
        console.error("Error analyzing paytable image:", error);
        throw error;
    }
};

// Machine Image Analysis by Wilton John Picou, III of GloCon Solutions, LLC
export const getMachineNameFromImage = async (image: { data: string; mimeType: string }): Promise<string> => {
    try {
        const genAI = getAi();
        const prompt = "Analyze this image of a slot machine. Identify the main game title displayed on the screen or cabinet. Return ONLY the game title as a single string.";

        const imagePart = { inlineData: { data: image.data, mimeType: image.mimeType } };
        const textPart = { text: prompt };

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error identifying machine from image:", error);
        throw error;
    }
};