// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useRef } from 'react';
import type { SessionSpin } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';

const BrainIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 18c-1.18 0-2.33-.2-3.4-.55a13.5 13.5 0 0 1-5.7-4.1c-1.1-1.35-1.7-3-1.7-4.75 0-2.5 1.2-4.75 3.2-6.25s4.5-2.25 7-2.25c2.5 0 4.8.75 6.7 2.15.5.38.8.95.8 1.6v.5c0 .65-.3 1.2-.8 1.6-1.9 1.4-4.2 2.15-6.7 2.15-2.5 0-4.8-.75-6.7-2.15-.5-.4-.8-1-.8-1.65v-.5c0-.65.3-1.2.8-1.6 1.9-1.4 4.2-2.15 6.7-2.15 1.6 0 3.2.35 4.6.95.4.18.8.4 1.15.65.3.25.6.5.85.8.5.6 1 1.3 1.3 2.1.3.8.45 1.65.45 2.5 0 1.7-.55 3.3-1.55 4.65l-.1.15c-.95 1.2-2.2 2.15-3.65 2.8l-.15.05c-1.2.45-2.45.7-3.75.7z" />
    </svg>
);

interface Phase3Props {
    spins: SessionSpin[];
    setSpins: React.Dispatch<React.SetStateAction<SessionSpin[]>>;
}

const Phase3_Psychology: React.FC<Phase3Props> = ({ spins, setSpins }) => {
    const [currentBet, setCurrentBet] = useState<number>(0);
    const [currentWin, setCurrentWin] = useState<number>(0);
    const totalNet = spins.reduce((acc, spin) => acc + (spin.win - spin.bet), 0);
    const ldwCount = spins.filter(s => s.win > 0 && s.win < s.bet).length;
    
    const winInputRef = useRef<HTMLInputElement>(null);

    const handleLogSpin = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentBet <= 0) {
            alert("Bet must be greater than zero.");
            return;
        }
        setSpins(prev => [{ bet: currentBet, win: currentWin }, ...prev]);
        // Don't reset bet, as it's often the same for many spins.
        setCurrentWin(0);
        winInputRef.current?.focus();
        winInputRef.current?.select();
    };

    return (
        <Card title="Session Tracker" icon={<BrainIcon />}>
            <p className="text-sm text-brand-subtle mb-4 font-sans">
                Track your spins to counter cognitive biases like "Losses Disguised as Wins" (LDW).
                An LDW is when the machine celebrates a "win" that is smaller than your original bet, resulting in a net loss.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Spin Logger */}
                <div>
                    <h3 className="font-semibold text-brand-secondary mb-2 font-serif text-lg">Live Spin Logger</h3>
                    <form onSubmit={handleLogSpin} className="space-y-3 bg-brand-bg/50 p-4 rounded-lg">
                        <Input 
                            label="Total Bet ($)" 
                            id="currentBet" 
                            type="number" 
                            step="0.01" 
                            value={currentBet || ''} 
                            onChange={e => setCurrentBet(parseFloat(e.target.value))}
                            placeholder="e.g., 2.50"
                        />
                        <Input 
                            label="Win Amount ($)" 
                            id="currentWin" 
                            type="number" 
                            step="0.01" 
                            value={currentWin || ''} 
                            onChange={e => setCurrentWin(parseFloat(e.target.value))}
                            ref={winInputRef}
                            placeholder="e.g., 1.20"
                        />
                        <Button type="submit" className="w-full">Log Spin</Button>
                    </form>
                    <div className="mt-4 flex justify-around text-center bg-black/50 p-4 rounded-lg border border-brand-subtle/20">
                        <div>
                            <span className="text-sm text-brand-subtle block font-sans">Total Net</span>
                            <span className={`text-2xl font-bold font-mono ${totalNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                ${totalNet.toFixed(2)}
                            </span>
                        </div>
                         <div>
                            <span className="text-sm text-brand-subtle block font-sans">Spins</span>
                            <span className="text-2xl font-bold text-brand-text font-mono">{spins.length}</span>
                        </div>
                        <div>
                            <span className="text-sm text-brand-subtle block font-sans">LDWs</span>
                            <span className="text-2xl font-bold text-yellow-400 font-mono">{ldwCount}</span>
                        </div>
                    </div>
                </div>

                {/* Spin History */}
                <div className="max-h-80 overflow-y-auto pr-2">
                     <h3 className="font-semibold text-brand-secondary mb-2 font-serif text-lg">Spin History</h3>
                    {spins.length === 0 ? (
                        <div className="text-sm text-brand-subtle text-center py-8 bg-brand-bg/20 rounded-lg font-sans">Your logged spins will appear here.</div>
                    ) : (
                        <ul className="space-y-2">
                            {spins.map((spin, index) => {
                                const net = spin.win - spin.bet;
                                const isLdw = spin.win > 0 && spin.win < spin.bet;
                                return (
                                    <li key={index} className={`flex justify-between items-center p-2 rounded-md text-sm ${isLdw ? 'bg-yellow-900/40 border border-yellow-700/50' : 'bg-brand-bg/50'}`}>
                                        <div>
                                            <span>Bet: ${spin.bet.toFixed(2)}</span>
                                            <span className="mx-2 text-brand-subtle/50">|</span>
                                            <span>Win: ${spin.win.toFixed(2)}</span>
                                        </div>
                                        <div className={`font-bold px-2 py-1 rounded text-xs ${net >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                                            {net >= 0 ? '+' : ''}${net.toFixed(2)}
                                            {isLdw && <span className="text-yellow-400 text-xs ml-2 font-normal font-sans">(LDW)</span>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default Phase3_Psychology;