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
          <h2 className="text-4xl font-sans text-brand-secondary tracking-widest">How to Play</h2>
        </div>
        <div className="space-y-4 text-brand-subtle max-h-[60vh] overflow-y-auto pr-2 font-mono text-sm">
            <dl className="space-y-4">
                <div>
                    <dt className="font-bold text-brand-text text-base font-sans">Step 1: Location & Bankroll</dt>
                    <dd>The app will auto-detect your jurisdiction. Confirm it, then select your casino from the list. If it's not listed, choose <span className="text-brand-accent font-bold">'Other (Enter Manually)'</span>. Finally, input your session bankroll and target hand-pay amount.</dd>
                </div>
                 <div>
                    <dt className="font-bold text-brand-text text-base font-sans">Step 2: Receive Your Plan</dt>
                    <dd>Our AI Analyst, using logic developed by Wilton John Picou, III, will generate a prescriptive 'Hergids' plan. This is your command list. It will tell you which specific machine to find, what denomination to play, and exactly how much to bet.</dd>
                </div>
                 <div>
                    <dt className="font-bold text-brand-text text-base font-sans">Step 3: Execute the Mission</dt>
                    <dd>Follow the plan without deviation. Use the Session Tracker to log your spins. The app will tell you when you've hit your 'Stop-Loss' or 'Win-Goal' for the current stage.</dd>
                </div>
                 <div>
                    <dt className="font-bold text-brand-text text-base font-sans">Step 4: Report Success</dt>
                    <dd>When you hit a hand-pay, press the <span className="text-brand-accent font-bold">'I WON! (Hand-Pay)'</span> button. This crucial feedback helps refine our core logic, making the AI smarter for everyone.</dd>
                </div>
                 <div>
                    <dt className="font-bold text-brand-primary text-base font-sans">Core Principle by Wilton John Picou, III</dt>
                    <dd>Trust the AI. Its plan is based on a complex analysis of vendor programming, casino odds, and our proprietary logic. Your role is to execute its strategy with discipline.</dd>
                </div>
            </dl>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;