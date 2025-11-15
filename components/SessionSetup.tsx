// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useEffect } from 'react';
import { getJurisdictionFromCoords, findCasinosInJurisdiction, searchForCasino, generateAiSessionPlan } from '../services/geminiService';
import type { SessionData } from '../App';
import Button from './common/Button';
import Input from './common/Input';
import Spinner from './common/Spinner';

interface SessionSetupProps {
    onSetupComplete: (data: Omit<SessionData, 'spins' | 'currentStageIndex'>) => void;
}

type SetupStep = 'location' | 'casino' | 'bankroll' | 'generating';

const Stepper: React.FC<{ currentStep: SetupStep }> = ({ currentStep }) => {
    const steps: { id: SetupStep; label: string }[] = [
        { id: 'location', label: 'Location' },
        { id: 'casino', label: 'Casino' },
        { id: 'bankroll', label: 'Bankroll' },
    ];
    const currentIndex = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="flex justify-between items-center mb-6 px-2">
            {steps.map((step, index) => {
                const isActive = index <= currentIndex || currentStep === 'generating';
                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-brand-primary text-brand-bg border-brand-primary' : 'bg-brand-surface border-brand-subtle'}`}>
                                {index + 1}
                            </div>
                            <p className={`mt-2 text-xs font-sans ${isActive ? 'text-brand-primary' : 'text-brand-subtle'}`}>{step.label}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-grow h-0.5 mx-2 ${isActive ? 'bg-brand-primary' : 'bg-brand-subtle'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const SessionSetup: React.FC<SessionSetupProps> = ({ onSetupComplete }) => {
    const [step, setStep] = useState<SetupStep>('location');
    const [jurisdiction, setJurisdiction] = useState('');
    const [preferredSlots, setPreferredSlots] = useState('high volatility, progressive jackpots');
    const [error, setError] = useState('');
    
    const [casinos, setCasinos] = useState<string[]>([]);
    const [isFetchingCasinos, setIsFetchingCasinos] = useState(false);
    const [selectedCasino, setSelectedCasino] = useState('');
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [manualCasinoQuery, setManualCasinoQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const juris = await getJurisdictionFromCoords(latitude, longitude);
                    setJurisdiction(juris);
                } catch (e) {
                    setError('Could not determine jurisdiction. You can enter it manually if needed.');
                }
            },
            () => {
                setError('Location access denied. Please select a jurisdiction manually.');
            },
            { timeout: 10000 }
        );
    }, []);

    const handleFetchCasinos = async () => {
        if (!jurisdiction) return;
        setIsFetchingCasinos(true);
        setError('');
        try {
            const casinoList = await findCasinosInJurisdiction(jurisdiction, preferredSlots);
            setCasinos(casinoList);
            if (casinoList.length > 0) {
                setSelectedCasino(casinoList[0]);
                setIsManualEntry(false);
            } else {
                setError('No casinos found for this jurisdiction. Please enter one manually.');
                setIsManualEntry(true);
            }
        } catch (e: any) {
            let errorMessage = 'Could not fetch casinos. Please try again or enter manually.';
            const errorString = (typeof e === 'object' && e !== null) ? JSON.stringify(e) : String(e);
            if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
                errorMessage = 'AI service is busy (rate limit exceeded). Please wait a moment and try again, or enter the casino manually.';
            }
            setError(errorMessage);
            setCasinos([]);
            setIsManualEntry(true);
        } finally {
            setIsFetchingCasinos(false);
        }
    };
    
    const handleConfirmLocation = async () => {
        if (!jurisdiction) {
            setError("Please select or enter a jurisdiction.");
            return;
        }
        await handleFetchCasinos();
        setStep('casino');
    };

     const handleManualSearch = async () => {
        if (!manualCasinoQuery) return;
        setIsSearching(true);
        setError('');
        try {
            const results = await searchForCasino(jurisdiction, manualCasinoQuery);
            if (results.length > 0) {
                setCasinos(prev => [...new Set([...results, ...prev])].sort((a, b) => a.localeCompare(b)));
                setSelectedCasino(results[0]);
                setIsManualEntry(false);
            } else {
                alert("No casinos found for that search. You can still enter it manually.");
                setSelectedCasino(manualCasinoQuery);
            }
        } catch (e: any) {
            let errorMessage = 'Could not perform search. Please try again or enter manually.';
            const errorString = (typeof e === 'object' && e !== null) ? JSON.stringify(e) : String(e);
            if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
                errorMessage = 'AI service is busy (rate limit exceeded). Please try again in a moment.';
            }
            setError(errorMessage);
        } finally {
            setIsSearching(false);
        }
    };

    const handleGeneratePlan = async () => {
        setStep('generating');
        setError('');
        try {
            if (!selectedCasino) {
                 throw new Error("A casino must be selected or entered.");
            }
            const result = await generateAiSessionPlan(bankroll, goal, jurisdiction, selectedCasino, freePlay);
            onSetupComplete({ jurisdiction, bankroll, goal, freePlay, casino: selectedCasino, ...result });
        } catch (e: any) {
            let errorMessage = 'An unknown error occurred while generating the plan.';
            const errorString = (typeof e === 'object' && e !== null) ? JSON.stringify(e) : String(e);

            if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
                errorMessage = 'AI service is busy (rate limit exceeded). Failed to generate plan. Please try again in a moment.';
            } else if (e instanceof Error) {
                errorMessage = e.message;
            }

            setError(errorMessage);
            setStep('bankroll');
        }
    };
    
    const [bankroll, setBankroll] = useState(500);
    const [goal, setGoal] = useState(5000);
    const [freePlay, setFreePlay] = useState(0);
    
    const renderContent = () => {
        switch (step) {
            case 'location':
                return (
                    <div className="text-center animate-fade-in space-y-4">
                        <h2 className="text-2xl font-serif font-bold text-brand-primary mb-2">Identify Jurisdiction</h2>
                        <p className="text-brand-subtle">
                            {jurisdiction ? `Detected Jurisdiction: ` : 'Attempting to detect location...'}
                            {jurisdiction && <span className="font-bold text-brand-accent">{jurisdiction}</span>}
                        </p>
                        
                        {error && !jurisdiction && <p className="text-brand-secondary mb-4">{error}</p>}
                        
                        <div>
                            <Input
                                label="Or Enter Manually"
                                id="manual-jurisdiction"
                                value={jurisdiction}
                                onChange={e => setJurisdiction(e.target.value)}
                                placeholder="e.g., California"
                            />
                        </div>
                         <div>
                            <Input
                                label="Preferred Slot Features (to prioritize casinos)"
                                id="preferred-slots"
                                value={preferredSlots}
                                onChange={e => setPreferredSlots(e.target.value)}
                                placeholder="e.g., high volatility, jackpots"
                            />
                        </div>

                        <Button onClick={handleConfirmLocation} variant="primary" disabled={isFetchingCasinos || !jurisdiction}>
                            {isFetchingCasinos ? <Spinner /> : "Confirm & Select Casino"}
                        </Button>
                    </div>
                );
            case 'casino':
                 return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4 text-center">Select Your Casino</h2>
                        {error && <p className="text-brand-secondary text-center font-sans mb-4">{error}</p>}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="casino-select" className="block text-sm font-sans tracking-wider text-brand-subtle mb-2">
                                   AI-Generated List for {jurisdiction}
                                </label>
                                <div className="flex gap-2">
                                <select
                                    id="casino-select"
                                    value={selectedCasino}
                                    onChange={e => setSelectedCasino(e.target.value)}
                                    className="w-full bg-black/30 border-2 border-brand-subtle/50 rounded-md p-3 text-brand-text focus:ring-0 focus:border-brand-primary focus:shadow-glow-primary transition-shadow duration-200 font-mono text-lg"
                                    disabled={isManualEntry}
                                >
                                    {casinos.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <Button onClick={handleFetchCasinos} disabled={isFetchingCasinos} className="flex-shrink-0">{isFetchingCasinos ? <Spinner/> : 'Refresh'}</Button>
                                </div>
                                 <Button onClick={() => setIsManualEntry(!isManualEntry)} variant={isManualEntry ? 'primary' : 'secondary'} className="w-full text-sm py-2 mt-2">
                                   {isManualEntry ? 'Select from List' : 'Search or Enter Manually'}
                                </Button>
                            </div>

                            {isManualEntry && (
                                <div className="animate-fade-in p-4 border border-brand-subtle/20 rounded-lg bg-black/20">
                                    <div className="flex gap-2">
                                        <Input
                                            label="Search for a casino"
                                            id="manualCasinoSearch"
                                            value={manualCasinoQuery}
                                            onChange={e => setManualCasinoQuery(e.target.value)}
                                            placeholder="e.g., Valley View"
                                        />
                                        <Button onClick={handleManualSearch} disabled={isSearching} className="self-end">{isSearching ? <Spinner/> : 'Search'}</Button>
                                    </div>
                                    <div className="relative flex items-center my-4">
                                        <div className="flex-grow border-t border-brand-subtle/30"></div>
                                        <span className="flex-shrink mx-4 text-brand-subtle text-xs font-sans">OR</span>
                                        <div className="flex-grow border-t border-brand-subtle/30"></div>
                                    </div>
                                    <Input
                                        label="Enter Casino Name Directly"
                                        id="manualCasino"
                                        value={selectedCasino}
                                        onChange={e => setSelectedCasino(e.target.value)}
                                        placeholder="e.g., Valley View Casino & Hotel"
                                    />
                                </div>
                            )}
                             <div className="flex gap-4 mt-4">
                                <Button onClick={() => setStep('location')} variant="secondary" className="w-full">Back</Button>
                                <Button onClick={() => setStep('bankroll')} variant="primary" className="w-full" disabled={!selectedCasino}>Next</Button>
                            </div>
                        </div>
                    </div>
                );
            case 'bankroll':
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4 text-center">Set Your Session</h2>
                        <div className="space-y-4">
                            <Input label="Input your entire session bankroll ($)" id="bankroll" type="number" value={bankroll || ''} onChange={e => setBankroll(parseInt(e.target.value))} />
                             <p className="text-xs text-center text-red-400 font-sans mt-2">{!bankroll && "Bankroll is required."}</p>
                            <Input label="Free Play Amount ($) (Enter 0 if none)" id="freePlay" type="number" value={freePlay || ''} onChange={e => setFreePlay(parseInt(e.target.value))} />
                            <Input label="Target Jackpot / Hand-Pay Amount ($)" id="goal" type="number" value={goal || ''} onChange={e => setGoal(parseInt(e.target.value))} />
                            <p className="text-xs text-center text-red-400 font-sans mt-2">{!goal && "Goal is required."}</p>
                            
                             <Button onClick={handleGeneratePlan} disabled={!bankroll || !goal || goal <= bankroll || !selectedCasino} variant="accent" className="w-full">
                                Generate Master Plan
                            </Button>
                            {goal > 0 && goal <= bankroll && <p className="text-red-400 text-xs text-center font-sans">Goal must be greater than bankroll.</p>}
                            {!selectedCasino && <p className="text-yellow-400 text-xs text-center font-sans">Please select a casino.</p>}
                            {error && <p className="text-brand-secondary text-center font-sans">{error}</p>}
                             <Button onClick={() => setStep('casino')} variant="secondary" className="w-full">Back</Button>
                        </div>
                    </div>
                );
            case 'generating':
                return (
                    <div className="text-center p-6 animate-fade-in">
                        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">AI Analyst is generating your plan...</h2>
                        <p className="text-brand-subtle mb-6">Analyzing casino odds, machine data, and gaming commission policies for {jurisdiction} according to the logic of Wilton John Picou, III...</p>
                        <Spinner />
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-brand-surface border border-brand-primary/30 rounded-lg animate-fade-in">
            <Stepper currentStep={step} />
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default SessionSetup;