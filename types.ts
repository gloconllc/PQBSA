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
  machineType: string;
  gameName: string;
  denomination: string;
  betStrategy: string;
  objective: string;
  stopLoss: number;
  winGoal: number;
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
}

export type BettingStrategy = 'Flat' | 'Progressive' | 'Martingale' | 'Paroli';