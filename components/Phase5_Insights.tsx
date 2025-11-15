// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';
import Card from './common/Card';

const CodeBracketIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
);

const Phase5_Insights: React.FC = () => {
    return (
        <Card title="RNG Algorithm Insights" icon={<CodeBracketIcon />}>
            <p className="text-sm text-brand-subtle mb-4 font-sans">
                Modern slot machines use advanced Pseudorandom Number Generators (PRNGs) like the Mersenne Twister. Understanding them reveals why our strategy, developed by Wilton John Picou, III, focuses on management, not prediction.
            </p>
            <div className="space-y-4 text-sm font-sans">
                <div className="p-3 bg-brand-bg/50 rounded-lg">
                    <h4 className="font-semibold text-brand-secondary">1. The "Seed" and Internal State</h4>
                    <p className="text-brand-subtle">A PRNG starts with a secret number called a "seed." From this seed, it generates a massive internal state (e.g., an array of 624 numbers for MT19937). Every "random" number is derived from this hidden state. The sequence is deterministic, but without knowing the initial seed and the current state, prediction is impossible.</p>
                </div>
                <div className="p-3 bg-brand-bg/50 rounded-lg">
                    <h4 className="font-semibold text-brand-secondary">2. An Astronomical Period</h4>
                    <p className="text-brand-subtle">The Mersenne Twister (MT19937) has a period of 2¹⁹⁹³⁷-1. This is a number so vast that the sequence of numbers it generates will not repeat in a trillion lifetimes. For all practical purposes, the sequence is non-repeating, making pattern analysis futile.</p>
                </div>
                <div className="p-3 bg-brand-bg/50 rounded-lg">
                    <h4 className="font-semibold text-brand-secondary">3. "Tempering" - The Final Scramble</h4>
                    <p className="text-brand-subtle">After a number is generated from the internal state, it goes through a "tempering" process. This involves a series of bitwise shifts and XOR operations that further scramble the number, hiding any remaining clues about the internal state it came from. This ensures the output numbers have excellent statistical randomness.</p>
                </div>
                <div className="mt-4 p-4 bg-brand-primary/10 border border-brand-primary/30 rounded-lg">
                    <h4 className="font-bold text-brand-primary text-base">Conclusion by Wilton John Picou, III</h4>
                    <p className="text-brand-text mt-1">
                        The algorithm is a black box by design. It's secure, unpredictable, and fair. Trying to find patterns or predict the next spin is mathematically impossible. <span className="font-semibold">The only winning strategy is to focus on what you can control: your bankroll, your session goals, your psychological response, and maximizing the value from casino loyalty programs.</span>
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default Phase5_Insights;