// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useMemo, useEffect } from 'react';
import type { SessionData } from '../App';
import type { SessionSpin } from '../types';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { refineStageForMachine, generateDynamicInsight, generateCompStrategy } from '../services/geminiService';

interface SessionViewProps {
    sessionData: SessionData;
    setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>;
    onEndSession: () => void;
}

const SessionTracker: React.FC<{ spins: SessionSpin[], onLogSpin: (spin: SessionSpin) => void, defaultBet: number }> = ({ spins, onLogSpin, defaultBet }) => {
    const [currentBet, setCurrentBet] = useState(defaultBet);
    const [currentWin, setCurrentWin] = useState(0);
    const winInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Update bet amount if the stage's default bet changes
        const betMatch = defaultBet;
        if (betMatch) {
            setCurrentBet(betMatch);
        }
    }, [defaultBet]);

    const handleLogSpin = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentBet <= 0) return;
        onLogSpin({ bet: currentBet, win: currentWin });
        setCurrentWin(0);
        winInputRef.current?.focus();
        winInputRef.current?.select();
    };

    const totalNet = spins.reduce((acc, spin) => acc + (spin.win - spin.bet), 0);
    const ldwCount = spins.filter(s => s.win > 0 && s.win < s.bet).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <form onSubmit={handleLogSpin} className="space-y-4 bg-black/30 p-4 rounded-lg">
                    <Input label="Total Bet ($)" id="currentBet" type="number" step="0.01" value={currentBet || ''} onChange={e => setCurrentBet(parseFloat(e.target.value))} />
                    <Input label="Win Amount ($)" id="currentWin" type="number" step="0.01" value={currentWin || ''} onChange={e => setCurrentWin(parseFloat(e.target.value))} ref={winInputRef} />
                    <Button type="submit" className="w-full" variant="primary">Log Spin</Button>
                </form>
                 <div className="mt-4 flex justify-around text-center bg-black/50 p-4 rounded-lg">
                    <div>
                        <span className="text-sm text-brand-subtle block font-sans">NET</span>
                        <span className={`text-2xl font-bold font-mono ${totalNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>${totalNet.toFixed(2)}</span>
                    </div>
                    <div>
                        <span className="text-sm text-brand-subtle block font-sans">SPINS</span>
                        <span className="text-2xl font-bold text-brand-text font-mono">{spins.length}</span>
                    </div>
                    <div>
                        <span className="text-sm text-brand-subtle block font-sans">LDWs</span>
                        <span className="text-2xl font-bold text-yellow-400 font-mono">{ldwCount}</span>
                    </div>
                </div>
            </div>
            <div className="max-h-80 overflow-y-auto pr-2">
                {spins.length > 0 ? (
                    <ul className="space-y-2">
                        {spins.map((spin, index) => {
                            const net = spin.win - spin.bet;
                            const isLdw = spin.win > 0 && spin.win < spin.bet;
                            return (
                                <li key={index} className={`flex justify-between items-center p-2 rounded-md text-sm ${isLdw ? 'bg-yellow-900/40 border border-yellow-700/50' : 'bg-black/30'}`}>
                                    <span>Bet: ${spin.bet.toFixed(2)} | Win: ${spin.win.toFixed(2)}</span>
                                    <span className={`font-bold ${net >= 0 ? 'text-green-300' : 'text-red-300'}`}>{net >= 0 ? '+' : ''}${net.toFixed(2)}</span>
                                </li>
                            );
                        })}
                    </ul>
                ) : <p className="text-center text-brand-subtle font-sans">Spin history appears here.</p>}
            </div>
        </div>
    );
};

const CompsOptimizer: React.FC<{ coinIn: number }> = ({ coinIn }) => {
    const [tier, setTier] = useState('');
    const [points, setPoints] = useState(0);
    const [strategy, setStrategy] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateCompStrategy(coinIn, tier, points);
            setStrategy(result);
        } catch (e: any) {
             let errorMessage = "Could not generate comp strategy. Please try again.";
             const errorString = (typeof e === 'object' && e !== null) ? JSON.stringify(e) : String(e);
             if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
                errorMessage = 'AI service is busy (rate limit exceeded). Please try again in a moment.';
            }
            setStrategy(errorMessage);
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Current Tier" id="tier" value={tier} onChange={e => setTier(e.target.value)} placeholder="e.g., Gold" />
                <Input label="Points to Next Tier" id="points" type="number" value={points || ''} onChange={e => setPoints(parseInt(e.target.value))} placeholder="e.g., 250" />
            </div>
            <div className="bg-black/30 p-4 rounded-lg text-center">
                    <span className="text-sm text-brand-subtle block font-sans">TOTAL COIN-IN</span>
                    <span className="text-2xl font-bold text-brand-primary font-mono">${coinIn.toFixed(2)}</span>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full flex justify-center" variant="secondary">
                {isLoading ? <Spinner /> : "Generate Comp Strategy"}
            </Button>
            {strategy && <div className="p-4 bg-black/30 rounded-lg text-brand-subtle font-sans">{strategy}</div>}
        </div>
    );
};

const AlgorithmInsights: React.FC<{ sessionData: SessionData, onGenerate: () => Promise<string> }> = ({ sessionData, onGenerate }) => {
    const [insight, setInsight] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await onGenerate();
            setInsight(result);
        } catch (e: any) {
            let errorMessage = "Could not generate insight. Please try again.";
            const errorString = (typeof e === 'object' && e !== null) ? JSON.stringify(e) : String(e);
             if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
                errorMessage = 'AI service is busy (rate limit exceeded). Please try again in a moment.';
            }
            setInsight(errorMessage);
        }
        setIsLoading(false);
    };

    return (
         <div className="space-y-4 text-sm font-sans text-brand-subtle">
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full flex justify-center" variant="secondary">
                {isLoading ? <Spinner /> : "Get Dynamic AI Insight"}
            </Button>
            {insight && <div className="p-4 bg-black/30 rounded-lg">{insight}</div>}
            <p className="pt-4 border-t border-brand-subtle/20"><strong className="text-brand-text">Why this works (Analysis by Wilton John Picou, III):</strong> Our AI doesn't predict random numbers. It creates a strategy based on a machine's known volatility, denomination, and the casino's required payback percentage for your jurisdiction.</p>
        </div>
    );
};


const SessionView: React.FC<SessionViewProps> = ({ sessionData, setSessionData, onEndSession }) => {
    const [activeTab, setActiveTab] = useState<'tracker' | 'comps' | 'insights'>('tracker');
    const [machineName, setMachineName] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    
    const { plan, spins, currentStageIndex, bankroll, freePlay, goal } = sessionData;

    const currentStage = plan[currentStageIndex];

    useEffect(() => {
        // When the session starts, integrate the free play into the main bankroll
        // to ensure net calculations are correct. This reflects the one-time
        // use of promotional credits at the beginning of a session.
        if (spins.length === 0 && freePlay > 0) {
            setSessionData(prev => {
                if (!prev) return null;
                // Per user request to account for freePlay usage at session start.
                // The freePlay amount is added to the bankroll to form a total credit pool.
                // This ensures that bets made against free play are correctly accounted for
                // in the totalNet calculation, which was the user's underlying goal.
                const newBankroll = prev.bankroll + prev.freePlay;
                return { 
                    ...prev, 
                    bankroll: newBankroll,
                    freePlay: 0 // Mark free play as consumed
                };
            });
        }
    }, []); // Run only once when the session view mounts

    const totalNet = useMemo(() => spins.reduce((acc, spin) => acc + (spin.win - spin.bet), 0), [spins]);
    const currentBankroll = bankroll + totalNet;
    const totalCoinIn = useMemo(() => spins.reduce((acc, spin) => acc + spin.bet, 0), [spins]);
    
    const progressPercentage = Math.max(0, Math.min(100, (currentBankroll / goal) * 100));

    const handleSuccess = () => {
        alert("SUCCESS RECORDED! This session data, under the guidance of Wilton John Picou, III, will be used to refine the USBA core logic. Congratulations!");
        onEndSession();
    }

    const handleLogSpin = (spin: SessionSpin) => {
        setSessionData(prev => prev ? ({ ...prev, spins: [spin, ...prev.spins] }) : null);
    };

    const handleStageChange = (direction: 'next' | 'prev') => {
        setSessionData(prev => {
            if (!prev) return null;
            let nextIndex = prev.currentStageIndex;
            if (direction === 'next') {
                nextIndex = Math.min(prev.plan.length - 1, prev.currentStageIndex + 1);
            } else {
                nextIndex = Math.max(0, prev.currentStageIndex - 1);
            }
            return { ...prev, currentStageIndex: nextIndex };
        });
    };
    
    const handleRefineStage = async () => {
        if (!machineName) return;
        setIsRefining(true);
        try {
            const refinedStage = await refineStageForMachine(currentStage, machineName, currentBankroll);
            setSessionData(prev => {
                if (!prev) return null;
                const newPlan = [...prev.plan];
                newPlan[prev.currentStageIndex] = refinedStage;
                return { ...prev, plan: newPlan };
            });
        } catch (error: any) {
            let errorMessage = "Failed to refine the plan for the specified machine.";
            const errorString = (typeof error === 'object' && error !== null) ? JSON.stringify(error) : String(error);
             if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
                errorMessage = 'AI service is busy (rate limit exceeded). Please try again in a moment.';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            alert(errorMessage);
        }
        setIsRefining(false);
    };

    const getDefaultBet = () => {
        const betMatch = currentStage.betStrategy.match(/\$(\d+\.\d+)/);
        return betMatch ? parseFloat(betMatch[1]) : 2.50;
    };
    
    const tabs = [
        { id: 'tracker', label: 'Session Tracker' },
        { id: 'comps', label: 'Comps Optimizer' },
        { id: 'insights', label: 'Algorithm Insights' },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center items-center">
                    <div>
                        <p className="text-sm font-sans text-brand-subtle uppercase">Initial Bankroll</p>
                        <p className="text-3xl font-mono font-bold text-brand-text">${bankroll.toFixed(2)}</p>
                    </div>
                     <div>
                        <p className="text-sm font-sans text-brand-subtle uppercase">Current Bankroll</p>
                        <p className={`text-5xl font-mono font-black ${currentBankroll >= bankroll ? 'text-brand-accent' : 'text-brand-secondary'}`}>
                            ${currentBankroll.toFixed(2)}
                        </p>
                    </div>
                     <div>
                        <p className="text-sm font-sans text-brand-subtle uppercase">Target Goal</p>
                        <p className="text-3xl font-mono font-bold text-brand-text">${goal.toFixed(2)}</p>
                    </div>
                </div>
                 <div className="w-full bg-black/30 rounded-full h-4 mt-4 border border-brand-subtle/50">
                    <div className="bg-brand-primary h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <p className="text-center text-sm text-brand-primary font-mono mt-2">{progressPercentage.toFixed(1)}% to Goal</p>
            </Card>

            <Card title={`Current Mission: Stage ${currentStage.stage} of ${plan.length}`} className="border-brand-accent/50">
                <div className="space-y-4">
                   <div className="text-center">
                     <p className="text-2xl text-brand-accent font-bold">Find "{currentStage.gameName}"</p>
                     <p className="text-lg text-brand-subtle font-sans">{currentStage.objective}</p>
                   </div>
                   <div className="p-4 bg-black/50 rounded-lg">
                        <p className="text-brand-subtle font-sans text-sm uppercase">Command</p>
                        <p className={`font-sans text-lg ${currentStage.isRefined ? 'text-brand-accent animate-pulse' : 'text-brand-text'}`}>{currentStage.betStrategy}</p>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-red-900/50 p-4 rounded text-center">
                            <span className="text-red-300 block font-sans uppercase">Stop-Loss At</span>
                            <span className="text-red-200 font-bold text-2xl">${currentStage.stopLoss.toFixed(2)}</span>
                       </div>
                       <div className="bg-green-900/50 p-4 rounded text-center">
                            <span className="text-green-300 block font-sans uppercase">Advance At</span>
                            <span className="text-green-200 font-bold text-2xl">${currentStage.winGoal.toFixed(2)}</span>
                       </div>
                   </div>
                   <div className="pt-4 border-t border-brand-subtle/30">
                       <h4 className="text-brand-secondary font-bold text-center font-sans mb-2">Machine Check-in (Optional)</h4>
                       <div className="flex gap-2">
                           <Input label="Enter exact machine name if different" id="machineName" value={machineName} onChange={e => setMachineName(e.target.value)} placeholder="e.g., Dragon Link Golden Century" />
                           <Button onClick={handleRefineStage} disabled={isRefining || !machineName} className="self-end flex-shrink-0">
                               {isRefining ? <Spinner/> : "Refine"}
                            </Button>
                       </div>
                   </div>
                   <div className="pt-4 flex justify-center items-center gap-4">
                     <Button onClick={() => handleStageChange('prev')} disabled={currentStageIndex === 0} variant="secondary">Prev Stage</Button>
                     <Button onClick={() => handleStageChange('next')} disabled={currentStageIndex === plan.length - 1} variant="secondary">Next Stage</Button>
                   </div>
                </div>
            </Card>

            <Card>
                <div className="flex border-b border-brand-primary/20 mb-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 text-lg font-sans transition-colors ${activeTab === tab.id ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-subtle'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div>
                    {activeTab === 'tracker' && <SessionTracker spins={spins} onLogSpin={handleLogSpin} defaultBet={getDefaultBet()} />}
                    {activeTab === 'comps' && <CompsOptimizer coinIn={totalCoinIn} />}
                    {activeTab === 'insights' && <AlgorithmInsights sessionData={sessionData} onGenerate={() => generateDynamicInsight(sessionData)} />}
                </div>
            </Card>
            
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleSuccess} variant="accent" className="w-full sm:w-auto">I WON! (Hand-Pay)</Button>
                <Button onClick={onEndSession} variant="secondary" className="w-full sm:w-auto">End Session</Button>
            </div>
        </div>
    );
};

export default SessionView;