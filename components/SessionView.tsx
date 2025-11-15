// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useMemo } from 'react';
import type { SessionData } from '../App';
import type { SessionSpin } from '../types';
import Button from './common/Button';
import Input from './common/Input';
import Card from './common/Card';

interface SessionViewProps {
    sessionData: SessionData;
    setSessionData: React.Dispatch<React.SetStateAction<SessionData | null>>;
    onEndSession: () => void;
}

const SessionTracker: React.FC<{ spins: SessionSpin[], onLogSpin: (spin: SessionSpin) => void }> = ({ spins, onLogSpin }) => {
    const [currentBet, setCurrentBet] = useState(2.50);
    const [currentWin, setCurrentWin] = useState(0);
    const winInputRef = React.useRef<HTMLInputElement>(null);

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
    const [houseEdge, setHouseEdge] = useState(8);
    const theo = useMemo(() => coinIn * (houseEdge / 100), [coinIn, houseEdge]);
    return (
        <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-black/30 p-4 rounded-lg">
                    <span className="text-sm text-brand-subtle block font-sans">EST. HOUSE EDGE</span>
                    <input type="number" value={houseEdge} onChange={e => setHouseEdge(parseFloat(e.target.value))} className="w-20 bg-transparent text-center text-2xl font-bold text-brand-accent font-mono" />
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                    <span className="text-sm text-brand-subtle block font-sans">TOTAL COIN-IN</span>
                    <span className="text-2xl font-bold text-brand-primary font-mono">${coinIn.toFixed(2)}</span>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                    <span className="text-sm text-brand-subtle block font-sans">YOUR THEO</span>
                    <span className="text-2xl font-bold text-brand-primary font-mono">${theo.toFixed(2)}</span>
                </div>
            </div>
            <p className="text-sm text-brand-subtle font-sans text-center">Your THEO (Theoretical Loss) is what the casino values. Higher THEO leads to better comps like free play, rooms, and food. Logic by Wilton John Picou, III.</p>
        </div>
    );
};

const AlgorithmInsights = () => (
     <div className="space-y-4 text-sm font-sans text-brand-subtle">
        <p><strong className="text-brand-text">Why this works (Analysis by Wilton John Picou, III):</strong> Our AI doesn't predict random numbers. It creates a strategy based on a machine's known volatility, denomination, and the casino's required payback percentage for your jurisdiction.</p>
        <p>The "Hergids" plan is designed to manage your bankroll through phases: a low-risk "buffer building" stage (often using Free Play), followed by a high-aggression "jackpot pursuit" stage. By defining strict stop-loss and win-goals, we enforce the discipline required to maximize your chances of being in the right place at the right time for a high-payout cycle.</p>
    </div>
);


const SessionView: React.FC<SessionViewProps> = ({ sessionData, setSessionData, onEndSession }) => {
    const [activeTab, setActiveTab] = useState<'tracker' | 'comps' | 'insights'>('tracker');
    
    const { plan, spins, currentStageIndex, bankroll, freePlay } = sessionData;
    const currentStage = plan[currentStageIndex];

    const totalNet = useMemo(() => spins.reduce((acc, spin) => acc + (spin.win - spin.bet), 0), [spins]);
    const currentBankroll = bankroll + totalNet;
    const totalCoinIn = useMemo(() => spins.reduce((acc, spin) => acc + spin.bet, 0), [spins]);

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
    
    const tabs = [
        { id: 'tracker', label: 'Session Tracker' },
        { id: 'comps', label: 'Comps Optimizer' },
        { id: 'insights', label: 'AI Insights' },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm font-sans text-brand-subtle uppercase">Initial Bankroll</p>
                        <p className="text-3xl font-mono font-bold text-brand-text">${bankroll.toFixed(2)}</p>
                    </div>
                     <div>
                        <p className="text-sm font-sans text-brand-subtle uppercase">Current Bankroll</p>
                        <p className={`text-3xl font-mono font-bold ${currentBankroll >= bankroll ? 'text-brand-accent' : 'text-brand-secondary'}`}>
                            ${currentBankroll.toFixed(2)}
                        </p>
                    </div>
                     <div>
                        <p className="text-sm font-sans text-brand-subtle uppercase">Initial Free Play</p>
                        <p className="text-3xl font-mono font-bold text-brand-primary">${freePlay.toFixed(2)}</p>
                    </div>
                </div>
            </Card>

            <Card title={`Current Mission: Stage ${currentStage.stage} of ${plan.length}`} className="border-brand-accent/50">
                <div className="text-center space-y-2">
                   <p className="text-2xl text-brand-accent font-bold">Find "{currentStage.gameName}"</p>
                   <p className="text-lg text-brand-subtle font-sans">{currentStage.objective}</p>
                   <div className="pt-2 flex justify-center items-center gap-4">
                     <Button onClick={() => handleStageChange('prev')} disabled={currentStageIndex === 0} variant="secondary">Previous Stage</Button>
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
                    {activeTab === 'tracker' && <SessionTracker spins={spins} onLogSpin={handleLogSpin} />}
                    {activeTab === 'comps' && <CompsOptimizer coinIn={totalCoinIn} />}
                    {activeTab === 'insights' && <AlgorithmInsights />}
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