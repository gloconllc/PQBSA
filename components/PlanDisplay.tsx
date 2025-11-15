// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';
import type { HergidStep } from '../types';
import Button from './common/Button';
import Card from './common/Card';

interface PlanDisplayProps {
    plan: HergidStep[];
    likelihood: number;
    analysis: string;
    onStartSession: () => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, likelihood, analysis, onStartSession }) => {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-serif font-bold text-brand-primary tracking-widest">YOUR MASTER PLAN</h2>
                <p className="text-brand-subtle mt-2">Execute with precision. This is your path to a hand-pay, designed by Wilton John Picou, III.</p>
            </div>

            <Card className="border-brand-accent/50">
                <h3 className="text-2xl font-serif font-bold text-brand-accent tracking-widest text-center mb-4">Mission Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="text-center">
                         <p className="font-sans text-brand-subtle uppercase">Initial Calculated Likelihood of Success</p>
                         <p className="font-mono text-7xl font-black text-brand-accent animate-pulse-slow">{likelihood}%</p>
                    </div>
                    <div className="md:col-span-2 text-sm font-sans text-brand-subtle bg-black/30 p-4 rounded-lg">
                        <p className="text-brand-text mb-2 font-bold">Mission Briefing by Wilton John Picou, III:</p>
                        {analysis}
                    </div>
                </div>
            </Card>

            <h3 className="text-3xl font-serif font-bold text-brand-primary tracking-widest text-center">Plan Directives</h3>
            <div className="space-y-4">
                {plan.map((step, index) => (
                    <div 
                        key={step.stage} 
                        className="bg-brand-surface p-4 rounded-lg border border-brand-primary/20"
                        style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.15}s forwards`, opacity: 0 }}
                    >
                        <h3 className="font-serif text-xl text-brand-primary">Stage {step.stage}: Locate "{step.gameName}"</h3>
                        
                        <div className="mt-4 p-4 bg-black/50 rounded-lg">
                            <p className="text-brand-subtle font-sans text-sm uppercase tracking-wider">Command</p>
                            <p className="font-sans text-lg text-brand-text">{step.betStrategy}</p>
                        </div>

                         <div className="mt-2 p-3 bg-brand-bg/30 rounded-lg">
                             <p className="text-brand-subtle font-sans text-xs uppercase tracking-wider">AI Reasoning</p>
                             <p className="font-sans text-sm text-brand-subtle italic">"{step.reasoning}"</p>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-2 gap-2 text-center">
                            <div className="bg-red-900/50 p-2 rounded">
                                <span className="text-red-300 block font-sans uppercase text-xs">Stop-Loss Trigger</span>
                                <span className="text-red-200 font-bold text-lg font-mono">${step.stopLoss.toFixed(2)}</span>
                            </div>
                            <div className="bg-green-900/50 p-2 rounded">
                                <span className="text-green-300 block font-sans uppercase text-xs">Advance Trigger</span>
                                <span className="text-green-200 font-bold text-lg font-mono">${step.winGoal.toFixed(2)}</span>
                            </div>
                        </div>
                         <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="bg-black/30 p-2 rounded text-center">
                                <span className="text-brand-subtle block font-sans uppercase text-xs">Time Limit</span>
                                <span className="text-brand-text font-bold text-lg font-mono">{step.timeLimitMinutes} minutes</span>
                            </div>
                            <div className="bg-brand-secondary/20 p-2 rounded">
                                <p className="text-brand-subtle font-sans text-xs uppercase tracking-wider text-center">Contingency Plan</p>
                                <p className="font-sans text-sm text-brand-subtle text-center">{step.contingencyPlan}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 text-center">
                <Button onClick={onStartSession} variant="accent" className="text-2xl px-12 py-4">
                   Begin Session
                </Button>
            </div>
        </div>
    );
};

export default PlanDisplay;