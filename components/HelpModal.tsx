// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';
import Button from './common/Button';

interface HelpModalProps {
  onClose: () => void;
}

const QuestionMarkCircleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
    </svg>
);

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-brand-surface rounded-lg shadow-2xl max-w-2xl w-full p-6 border-2 border-brand-secondary/50 shadow-glow-secondary">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-brand-secondary"><QuestionMarkCircleIcon /></span>
          <h2 className="text-4xl font-serif text-brand-secondary tracking-widest">How It Works</h2>
        </div>
        <div className="space-y-4 text-brand-subtle max-h-[60vh] overflow-y-auto pr-2 font-mono text-sm">
            <dl className="space-y-4">
                <div>
                    <dt className="font-bold text-brand-text text-base font-sans">Step 1: SESSION SETUP</dt>
                    <dd>Follow the on-screen steps. First, confirm your gaming <span className="text-brand-accent">Jurisdiction</span>. Second, select your <span className="text-brand-accent">Casino</span> from the AI-generated list, or use the manual search. Finally, input your <span className="text-brand-accent">Bankroll</span>, <span className="text-brand-accent">Free Play</span>, and hand-pay <span className="text-brand-accent">Goal</span>.</dd>
                </div>
                <div>
                    <dt className="font-bold text-brand-text text-base font-sans">Step 2: MASTER PLAN</dt>
                    <dd>The AI will generate a multi-stage plan using its maximum thinking capacity. Review the directives for each stage, including the target machine, bet strategy, time limits, and critical stop-loss/win-goal triggers. This plan is your strategic roadmap.</dd>
                </div>
                <div>
                    <dt className="font-bold text-brand-text text-base font-sans">Step 3: EXECUTE & TRACK</dt>
                    <dd>Begin your session. Follow the plan with discipline. Use the <span className="text-brand-accent">Session Tracker</span> to log every spin. This data is vital for tracking your progress and managing cognitive biases.</dd>
                </div>
                 <div>
                    <dt className="font-bold text-brand-text text-base font-sans">Step 4: DYNAMIC REFINEMENT</dt>
                    <dd>If you can't find the exact machine in your plan, use the <span className="text-brand-accent">Machine Check-in</span> feature. Enter the name of the machine you are playing, and the AI will refine your strategy in real-time for that specific game.</dd>
                </div>
                <div>
                    <dt className="font-bold text-brand-text text-base font-sans">ANALYZE ENVIRONMENT</dt>
                    <dd>At any time, press "Analyze Environment" in the header to get a live AI analysis of the gaming conditions in your current jurisdiction.</dd>
                </div>
            </dl>
            <p className="font-bold text-brand-text pt-4 border-t border-brand-subtle/20">This protocol is the proprietary logic of Wilton John Picou, III of GloCon Solutions, LLC. It is designed to provide a strategic framework for bankroll management, not to predict outcomes.</p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
