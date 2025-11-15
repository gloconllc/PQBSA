// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useEffect } from 'react';
import type { HergidStep, SessionSpin, GroundingChunk } from './types';
import DisclaimerModal from './components/DisclaimerModal';
import SessionSetup from './components/SessionSetup';
import PlanDisplay from './components/PlanDisplay';
import SessionView from './components/SessionView';
import HelpModal from './components/HelpModal';
import IntelModal from './components/IntelModal';
import Button from './components/common/Button';
import { fetchRegionalOdds } from './services/geminiService';

const SESSION_STORAGE_KEY = 'pq-protocol-session';

export interface SessionData {
    jurisdiction: string;
    casino: string;
    bankroll: number;
    goal: number;
    freePlay: number;
    plan: HergidStep[];
    likelihood: number;
    analysis: string;
    spins: SessionSpin[];
    currentStageIndex: number;
}

type AppState = 'disclaimer' | 'setup' | 'plan' | 'session';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('disclaimer');
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [showHelp, setShowHelp] = useState(false);
    const [showIntelModal, setShowIntelModal] = useState(false);
    const [intelData, setIntelData] = useState<{ analysis: string; sources: GroundingChunk[] } | null>(null);
    const [isIntelLoading, setIsIntelLoading] = useState(false);


    useEffect(() => {
        try {
            const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
            if (savedSession) {
                const parsedData = JSON.parse(savedSession);
                 // Create a default session structure to merge with loaded data
                // This ensures backward compatibility if the data shape changes
                const data: SessionData = {
                    jurisdiction: 'Nevada',
                    casino: '',
                    bankroll: 0,
                    goal: 0,
                    freePlay: 0,
                    plan: [],
                    likelihood: 0,
                    analysis: '',
                    spins: [],
                    currentStageIndex: 0,
                    ...parsedData, // Overwrite defaults with any saved values
                };
                setSessionData(data);
                setAppState('session');
            } else {
                 setAppState('disclaimer');
            }
        } catch (error) {
            console.error("Failed to load session from storage:", error);
            localStorage.removeItem(SESSION_STORAGE_KEY);
            setAppState('disclaimer');
        }
    }, []);

    useEffect(() => {
        if (sessionData) {
            try {
                localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
            } catch (error) {
                console.error("Failed to save session to storage:", error);
            }
        }
    }, [sessionData]);

    const handleSetupComplete = (data: Omit<SessionData, 'spins' | 'currentStageIndex'>) => {
        const fullSessionData: SessionData = {
            ...data,
            spins: [],
            currentStageIndex: 0,
        };
        setSessionData(fullSessionData);
        setAppState('plan');
    };

    const handleEndSession = () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setSessionData(null);
        setAppState('setup');
    };

    const handleAnalyzeEnvironment = async () => {
        if (!sessionData?.jurisdiction) {
            alert("A session with a jurisdiction must be active to analyze the environment.");
            return;
        }
        setIsIntelLoading(true);
        setShowIntelModal(true);
        setIntelData(null);
        try {
            const result = await fetchRegionalOdds(sessionData.jurisdiction);
            setIntelData(result);
        } catch (e: any) {
            let errorMessage = "Could not fetch regional odds analysis. The AI model may be temporarily unavailable or the jurisdiction is not well-documented.";
            const errorString = (typeof e === 'object' && e !== null) ? JSON.stringify(e) : String(e);
             if (errorString.includes('RESOURCE_EXHAUSTED') || errorString.includes('429')) {
                errorMessage = 'AI service is busy (rate limit exceeded). Please try again in a moment.';
            }
            setIntelData({ analysis: errorMessage, sources: [] });
        } finally {
            setIsIntelLoading(false);
        }
    };

    const renderContent = () => {
        switch (appState) {
            case 'disclaimer':
                return <DisclaimerModal onAccept={() => setAppState('setup')} />;
            case 'setup':
                return <SessionSetup onSetupComplete={handleSetupComplete} />;
            case 'plan':
                if (!sessionData) return null;
                return <PlanDisplay 
                    plan={sessionData.plan} 
                    likelihood={sessionData.likelihood} 
                    analysis={sessionData.analysis} 
                    onStartSession={() => setAppState('session')} 
                />;
            case 'session':
                if (!sessionData) return null;
                return <SessionView 
                    sessionData={sessionData} 
                    setSessionData={setSessionData} 
                    onEndSession={handleEndSession} 
                />;
            default:
                return <div>Loading...</div>;
        }
    };

    return (
        <div className="bg-brand-bg text-brand-text min-h-screen font-sans">
            <header className="p-4 flex justify-between items-center bg-brand-surface/80 backdrop-blur-sm border-b border-brand-primary/20 sticky top-0 z-10">
                <h1 className="text-2xl font-serif font-bold text-brand-primary tracking-widest">P.Q. Betting Strategy</h1>
                 <div>
                    <Button onClick={handleAnalyzeEnvironment} variant="secondary" className="mr-4" disabled={!sessionData}>Analyze Environment</Button>
                    <Button onClick={() => setShowHelp(true)} variant="secondary">Help</Button>
                </div>
            </header>
            <main className="p-4 sm:p-6 md:p-8">
                {renderContent()}
            </main>
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
            {showIntelModal && (
                <IntelModal 
                    onClose={() => setShowIntelModal(false)} 
                    data={intelData}
                    isLoading={isIntelLoading}
                />
            )}
        </div>
    );
};

export default App;