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
                <h2 className="text-4xl font-bold text-brand-primary tracking-widest">YOUR MASTER PLAN</h2>
                <p className="text-brand-subtle mt-2">Execute with precision. This is your path to a hand-pay, designed by Wilton John Picou, III.</p>
            </div>

            <Card className="border-brand-accent/50">
                <h3 className="text-2xl font-bold text-brand-accent tracking-widest text-center mb-4">AI Likelihood Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="text-center">
                         <p className="font-sans text-brand-subtle uppercase">Likelihood of Success with this Plan</p>
                         <p className="font-mono text-7xl font-black text-brand-accent animate-pulse-slow">{likelihood}%</p>
                    </div>
                    <div className="md:col-span-2 text-sm font-sans text-brand-subtle bg-black/30 p-4 rounded-lg">
                        <p className="text-brand-text mb-2 font-bold">Strategic Analysis by Wilton John Picou, III:</p>
                        {analysis}
                    </div>
                </div>
            </Card>

            <div className="space-y-4">
                {plan.map((step, index) => (
                    <div 
                        key={step.stage} 
                        className="bg-brand-surface p-4 rounded-lg border border-brand-primary/20"
                        style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.2}s forwards`, opacity: 0 }}
                    >
                        <h3 className="font-sans text-xl text-brand-primary">Stage {step.stage}: Find "{step.gameName}"</h3>
                        <p className="text-sm text-brand-subtle font-sans">{step.objective}</p>
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono">
                            <div className="bg-black/30 p-2 rounded">
                                <span className="text-brand-subtle block font-sans uppercase">Machine Type</span>
                                <span className="text-brand-text font-semibold">{step.machineType}</span>
                            </div>
                            <div className="bg-black/30 p-2 rounded">
                                <span className="text-brand-subtle block font-sans uppercase">Denomination</span>
                                <span className="text-brand-text font-semibold">{step.denomination}</span>
                            </div>
                             <div className="bg-black/30 p-2 rounded">
                                <span className="text-brand-subtle block font-sans uppercase">Target Spins</span>
                                <span className="text-brand-text font-semibold">~{step.spinCount}</span>
                            </div>
                            <div className="bg-black/30 p-2 rounded col-span-2">
                                <span className="text-brand-subtle block font-sans uppercase">Command</span>
                                <span className="text-brand-accent font-semibold">{step.betStrategy}</span>
                            </div>
                             <div className="bg-red-900/50 p-2 rounded col-span-2 md:col-span-2">
                                <span className="text-red-300 block font-sans uppercase">Stop-Loss At</span>
                                <span className="text-red-200 font-bold text-base">${step.stopLoss.toFixed(2)}</span>
                            </div>
                            <div className="bg-green-900/50 p-2 rounded col-span-2 md:col-span-3">
                                <span className="text-green-300 block font-sans uppercase">Advance At</span>
                                <span className="text-green-200 font-bold text-base">${step.winGoal.toFixed(2)}</span>
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