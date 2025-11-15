// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useEffect } from 'react';
import type { HergidStep, SessionSpin } from './types';
import DisclaimerModal from './components/DisclaimerModal';
import SessionSetup from './components/SessionSetup';
import PlanDisplay from './components/PlanDisplay';
import SessionView from './components/SessionView';
import HelpModal from './components/HelpModal';
import Button from './components/common/Button';

const SESSION_STORAGE_KEY = 'usba-session';

export interface SessionData {
    jurisdiction: string;
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

    useEffect(() => {
        try {
            const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
            if (savedSession) {
                const data: SessionData = JSON.parse(savedSession);
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
                <h1 className="text-2xl font-bold text-brand-primary tracking-widest">USBA</h1>
                <Button onClick={() => setShowHelp(true)} variant="secondary">Help</Button>
            </header>
            <main className="p-4 sm:p-6 md:p-8">
                {renderContent()}
            </main>
            {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        </div>
    );
};

export default App;