// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useEffect } from 'react';
import { getJurisdictionFromCoords, findCasinosInJurisdiction, generateAiSessionPlan } from '../services/geminiService';
import type { SessionData } from '../App';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';

interface SessionSetupProps {
    onSetupComplete: (data: Omit<SessionData, 'spins' | 'currentStageIndex'>) => void;
}

const SessionSetup: React.FC<SessionSetupProps> = ({ onSetupComplete }) => {
    const [step, setStep] = useState<'location' | 'casino' | 'bankroll' | 'generating'>('location');
    const [jurisdiction, setJurisdiction] = useState('');
    const [error, setError] = useState('');
    
    const [casinos, setCasinos] = useState<string[]>([]);
    const [isFetchingCasinos, setIsFetchingCasinos] = useState(false);
    const [selectedCasino, setSelectedCasino] = useState('');
    const [manualCasino, setManualCasino] = useState('');

    const [bankroll, setBankroll] = useState(500);
    const [goal, setGoal] = useState(5000);
    const [freePlay, setFreePlay] = useState(0);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const juris = await getJurisdictionFromCoords(position.coords.latitude, position.coords.longitude);
                    setJurisdiction(juris);
                } catch (e) {
                    setError('Could not determine jurisdiction. Defaulting to "Nevada".');
                    setJurisdiction('Nevada');
                }
            },
            () => {
                setError('Location access denied. Defaulting to "Nevada".');
                setJurisdiction('Nevada');
            },
            { timeout: 10000 }
        );
    }, []);

    const handleConfirmLocation = async () => {
        if (!jurisdiction) return;
        setIsFetchingCasinos(true);
        setError('');
        try {
            const casinoList = await findCasinosInJurisdiction(jurisdiction);
            setCasinos(casinoList);
            if (casinoList.length > 0) {
                setSelectedCasino(casinoList[0]);
            }
            setStep('casino');
        } catch (e) {
            setError('Could not fetch casinos. Please proceed with manual entry.');
            setSelectedCasino('Other'); // Force manual entry on error
            setStep('casino'); 
        } finally {
            setIsFetchingCasinos(false);
        }
    };

    const handleGeneratePlan = async () => {
        setStep('generating');
        setError('');
        try {
            const finalCasino = selectedCasino === 'Other' ? manualCasino : selectedCasino;
            if (!finalCasino) {
                throw new Error("Casino name is required.");
            }
            const result = await generateAiSessionPlan(bankroll, goal, jurisdiction, finalCasino, freePlay);
            onSetupComplete({ jurisdiction, bankroll, goal, freePlay, ...result });
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            setStep('bankroll');
        }
    };
    
    const renderLocationStep = () => (
        <div className="text-center p-6 bg-brand-surface border border-brand-primary/30 rounded-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">Detecting Location...</h2>
            {!jurisdiction && !error && <Spinner />}
            {error && <p className="text-brand-secondary mb-4">{error}</p>}
            {jurisdiction && (
                <>
                    <p className="text-xl mb-6">Gaming Jurisdiction Detected: <span className="font-bold text-brand-accent">{jurisdiction}</span></p>
                    <Button onClick={handleConfirmLocation} variant="primary" disabled={isFetchingCasinos}>
                        {isFetchingCasinos ? <Spinner /> : "Confirm & Select Casino"}
                    </Button>
                </>
            )}
        </div>
    );

    const renderCasinoStep = () => (
        <div className="p-6 bg-brand-surface border border-brand-primary/30 rounded-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-brand-primary mb-6 text-center">Select Your Casino</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="casino" className="block text-sm font-sans tracking-wider text-brand-subtle mb-2">
                        Choose from casinos in {jurisdiction}
                    </label>
                    <select
                        id="casino"
                        value={selectedCasino}
                        onChange={e => setSelectedCasino(e.target.value)}
                        className="w-full bg-black/30 border-2 border-brand-subtle/50 rounded-md p-3 text-brand-text focus:ring-0 focus:border-brand-primary focus:shadow-glow-primary transition-shadow duration-200 font-mono text-lg"
                    >
                        {casinos.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="Other">Other (Enter Manually)</option>
                    </select>
                </div>

                {selectedCasino === 'Other' && (
                     <div className="animate-fade-in">
                        <Input
                            label="Enter Casino Name Manually"
                            id="manualCasino"
                            value={manualCasino}
                            onChange={e => setManualCasino(e.target.value)}
                            placeholder="e.g., Valley View Casino"
                        />
                    </div>
                )}
                
                <Button onClick={() => setStep('bankroll')} variant="primary" className="w-full">Next: Set Bankroll</Button>
            </div>
        </div>
    );

    const renderBankrollStep = () => (
         <div className="p-6 bg-brand-surface border border-brand-primary/30 rounded-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-brand-primary mb-6 text-center">Set Your Session</h2>
            <div className="space-y-6">
                <Input label="Input your entire session bankroll ($)" id="bankroll" type="number" value={bankroll || ''} onChange={e => setBankroll(parseInt(e.target.value))} />
                <Input label="Free Play Amount ($) (Enter 0 if none)" id="freePlay" type="number" value={freePlay || ''} onChange={e => setFreePlay(parseInt(e.target.value))} />
                <Input label="Target Jackpot / Hand-Pay Amount ($)" id="goal" type="number" value={goal || ''} onChange={e => setGoal(parseInt(e.target.value))} />
                <Button 
                  onClick={handleGeneratePlan} 
                  disabled={!bankroll || !goal || goal <= bankroll || (selectedCasino === 'Other' && !manualCasino)} 
                  variant="accent" 
                  className="w-full"
                >
                    Generate Master Plan
                </Button>
                {goal > 0 && goal <= bankroll && <p className="text-red-400 text-xs text-center font-sans">Goal must be greater than bankroll.</p>}
                {(selectedCasino === 'Other' && !manualCasino) && <p className="text-yellow-400 text-xs text-center font-sans">Please enter a casino name.</p>}
                {error && <p className="text-brand-secondary text-center font-sans">{error}</p>}
            </div>
        </div>
    );

    const renderGeneratingStep = () => (
         <div className="text-center p-6 bg-brand-surface border border-brand-primary/30 rounded-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-brand-primary mb-4">AI Analyst is generating your plan...</h2>
            <p className="text-brand-subtle mb-6">Analyzing casino odds, machine data, and gaming commission policies for {jurisdiction} according to the logic of Wilton John Picou, III...</p>
            <Spinner />
        </div>
    );


    return (
        <div className="max-w-2xl mx-auto">
            {step === 'location' && renderLocationStep()}
            {step === 'casino' && renderCasinoStep()}
            {step === 'bankroll' && renderBankrollStep()}
            {step === 'generating' && renderGeneratingStep()}
        </div>
    );
};

export default SessionSetup;