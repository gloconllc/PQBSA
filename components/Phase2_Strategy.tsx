// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState } from 'react';
import type { BankrollInfo, HergidStep, BettingStrategy } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { generateAiSessionPlan } from '../services/geminiService';

interface Phase2Props {
  bankroll: BankrollInfo;
  onBankrollUpdate: (info: BankrollInfo) => void;
  jurisdiction: string;
  casino: string;
}

const TrophyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 1 9 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 16.5c-1.125 0-2.206-.39-3.093-1.057a9.734 9.734 0 0 0-1.68-1.057 9.734 9.734 0 0 0-1.68 1.057c-.887.667-1.968 1.057-3.093 1.057m11.16 0c.346 0 .683.026 1.012.073m-12.184 0c-.329-.047-.666-.073-1.012-.073" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75v-3.75m0 0a9.75 9.75 0 0 1 5.656-1.928M12 18a9.75 9.75 0 0 0-5.656-1.928m11.312 0a9.728 9.728 0 0 1 2.288 4.604M3.044 16.072c.67.204 1.358.328 2.06.396m9.792 0c.702-.068 1.39-.192 2.06-.396M3.044 16.072a9.75 9.75 0 0 0-2.288 4.604" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3.031c.294.618.662 1.192 1.09 1.699a9.75 9.75 0 0 1 12.74 0 9.728 9.728 0 0 1 2.628 5.46M3 3.031a9.75 9.75 0 0 0-2.288 4.604" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 3.031c-.294.618-.662 1.192-1.09 1.699a9.75 9.75 0 0 0-12.74 0A9.728 9.728 0 0 0 4.543 10.1M21 3.031a9.75 9.75 0 0 1 2.288 4.604" />
    </svg>
);

const CoinsIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);


const Phase2_Strategy: React.FC<Phase2Props> = ({ bankroll, onBankrollUpdate, jurisdiction, casino }) => {
  const [sessionPlan, setSessionPlan] = useState<HergidStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<BettingStrategy>('Progressive');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onBankrollUpdate({ ...bankroll, [name]: parseFloat(value) || 0 });
  };
  
  const handleGeneratePlan = async () => {
      setIsLoading(true);
      setError(null);
      setSessionPlan([]);
      try {
        const result = await generateAiSessionPlan(bankroll.total, bankroll.goal, jurisdiction, casino, bankroll.freePlay || 0, strategy);
        setSessionPlan(result.plan);
      } catch (e) {
          setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
          setIsLoading(false);
      }
  };

  const isButtonDisabled = !bankroll.total || !bankroll.goal || bankroll.goal <= bankroll.total || !jurisdiction || !casino || isLoading;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Bankroll & Goals" icon={<TrophyIcon />}>
        <div className="space-y-4">
          <Input label="Session Bankroll ($)" id="total" name="total" type="number" value={bankroll.total || ''} onChange={handleInputChange} placeholder="e.g., 500" />
          <Input label="Free Play ($) (Enter 0 if none)" id="freePlay" name="freePlay" type="number" value={bankroll.freePlay || ''} onChange={handleInputChange} />
          <Input label="Hand-Pay Goal ($)" id="goal" name="goal" type="number" value={bankroll.goal || ''} onChange={handleInputChange} placeholder="e.g., 1200" />
          
          <div>
            <label htmlFor="strategy" className="block text-sm font-sans tracking-wider text-brand-subtle mb-2">
                Preferred Betting Strategy
            </label>
            <select
                id="strategy"
                value={strategy}
                onChange={e => setStrategy(e.target.value as BettingStrategy)}
                className="w-full bg-black/30 border-2 border-brand-subtle/50 rounded-md p-3 text-brand-text placeholder-brand-subtle/50 focus:ring-0 focus:border-brand-primary focus:shadow-glow-primary transition-shadow duration-200 font-mono text-lg"
            >
                <option>Flat</option>
                <option>Progressive</option>
                <option>Martingale</option>
                <option>Paroli</option>
            </select>
          </div>

          <div className="pt-2">
            <Button onClick={handleGeneratePlan} className="w-full flex items-center justify-center" disabled={isButtonDisabled} variant="accent">
                {isLoading ? <Spinner /> : <CoinsIcon />}
                {isLoading ? 'Generating Plan...' : 'Generate AI-Powered Plan'}
            </Button>
            {bankroll.goal > 0 && bankroll.goal <= bankroll.total && <p className="text-red-400 text-xs text-center mt-2 font-sans">Goal must be greater than bankroll.</p>}
            {!jurisdiction && <p className="text-yellow-400 text-xs text-center mt-2 font-sans">Please select a jurisdiction in Phase 1 first.</p>}
          </div>
        </div>
      </Card>
      
      <div className="md:col-span-1">
        <h3 className="text-3xl font-sans text-brand-secondary tracking-widest mb-4">AI-Generated "Hergids" Plan</h3>
        <div className="space-y-4">
            {isLoading && <div className="p-4 bg-brand-surface/50 rounded-md"><Spinner /></div>}
            {error && <p className="text-red-400 p-4 bg-red-900/20 rounded-md font-sans">{error}</p>}
            
            {!isLoading && !error && sessionPlan.length === 0 && (
                <p className="text-brand-subtle p-4 bg-brand-surface/50 rounded-md font-sans">Your personalized, AI-generated session plan will appear here once you enter your details and generate a plan.</p>
            )}

            {sessionPlan.map(step => (
                <div key={step.stage} className="bg-brand-surface p-4 rounded-lg border-2 border-brand-secondary/30 animate-fade-in">
                    <h4 className="font-sans text-xl text-brand-secondary">Stage {step.stage}: {step.machineType}</h4>
                    <p className="text-sm text-brand-subtle font-sans">{step.objective}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-brand-bg/50 p-2 rounded">
                            <span className="text-brand-subtle block font-sans">Bet Strategy</span>
                            <span className="text-brand-text font-semibold">{step.betStrategy}</span>
                        </div>
                        <div className="bg-brand-bg/50 p-2 rounded">
                            <span className="text-brand-subtle block font-sans">Denomination</span>
                            <span className="text-brand-text font-semibold">{step.denomination}</span>
                        </div>
                        <div className="bg-red-900/50 p-2 rounded">
                            <span className="text-red-300 block font-sans">Stop-Loss At</span>
                            <span className="text-red-200 font-bold">${step.stopLoss.toFixed(2)}</span>
                        </div>
                        <div className="bg-green-900/50 p-2 rounded">
                            <span className="text-green-300 block font-sans">Advance At</span>
                            <span className="text-green-200 font-bold">${step.winGoal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Phase2_Strategy;