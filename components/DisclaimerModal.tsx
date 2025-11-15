// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';
import Button from './common/Button';

interface DisclaimerModalProps {
  onAccept: () => void;
}

const ShieldCheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </svg>
);

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-brand-surface rounded-lg shadow-2xl max-w-2xl w-full p-6 border-2 border-brand-primary/50 shadow-glow-primary">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-brand-primary"><ShieldCheckIcon /></span>
          <h2 className="text-4xl font-serif text-brand-primary tracking-widest">Disclaimer</h2>
        </div>
        <div className="space-y-4 text-brand-subtle max-h-[60vh] overflow-y-auto pr-2 font-mono text-sm">
          <p>The P.Q. Protocol (Proprietary Quantum Protocol) is an analytical tool for informational and entertainment purposes only. This work is the intellectual property of Wilton John Picou, III of GloCon Solutions, LLC.</p>
          <p><span className="font-bold text-brand-text">This app does NOT guarantee winnings or predict outcomes.</span> Slot machines are games of chance, and their outcomes are determined by a regulated Random Number Generator (RNG).</p>
          <p>The strategies provided are based on the proprietary AI logic of Wilton John Picou, III of GloCon Solutions, LLC for bankroll management and volatility assessment. They are designed to manage your funds strategically, not to influence the machine's results.</p>
          <p>This app does <span className="font-bold text-brand-text">NOT</span> electronically interfere with, communicate with, or modify any slot machine hardware or software.</p>
          <p className="font-bold text-brand-secondary">Gambling can be addictive. Please play responsibly and within your means. If you have a gambling problem, seek help.</p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onAccept} variant="primary">I Understand and Accept</Button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;