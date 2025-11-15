// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

export interface MachineData {
  gameName: string;
  vendor: string;
  denomination: number;
  maxBet: number;
}

export interface BankrollInfo {
  total: number;
  goal: number;
  freePlay: number;
}

export interface HergidStep {
  stage: number;
  gameName: string;
  betStrategy: string;
  reasoning: string;
  objective: string;
  stopLoss: number;
  winGoal: number;
  timeLimitMinutes: number;
  contingencyPlan: string;
  isRefined?: boolean;
  // Deprecated fields, kept for potential backward compatibility with old local storage data
  machineType: string;
  denomination: string;
  spinCount: number;
}

export interface SessionSpin {
  bet: number;
  win: number;
}

export interface CompsInfo {
  currentTier: string;
  pointsToNext: number;
  theo: number;
  coinIn: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: { 
        reviewSnippets: { 
            uri: string; 
            content: string 
        }[] 
    }[]
  };
}

export type BettingStrategy = 'Flat' | 'Progressive' | 'Martingale' | 'Paroli';