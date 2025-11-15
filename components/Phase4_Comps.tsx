// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useMemo } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';

interface Phase4Props {
  coinIn: number;
}

const StarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
);


const Phase4_Comps: React.FC<Phase4Props> = ({ coinIn }) => {
    const [tier, setTier] = useState('');
    const [pointsToNext, setPointsToNext] = useState<number>(0);
    const [houseEdge, setHouseEdge] = useState<number>(8);
    const [suggestion, setSuggestion] = useState('');

    const theo = useMemo(() => {
        return coinIn * (houseEdge / 100);
    }, [coinIn, houseEdge]);

    const generateSuggestion = () => {
        if (!tier || pointsToNext <= 0) {
            setSuggestion("Please enter your current tier and points needed to generate a strategy.");
            return;
        }

        if (pointsToNext < 100) {
            setSuggestion(`You're very close! With only ${pointsToNext} points needed for the next tier, a short, focused session on a $1 machine could get you there. This will significantly boost your comp value for future trips.`);
        } else if (pointsToNext < 500) {
            setSuggestion(`You're within striking distance. To reach the next tier, plan for a session with a target coin-in of around $${(pointsToNext * 1.5).toFixed(0)}. This balances chasing the tier with responsible play.`);
        } else {
            setSuggestion(`The next tier is a longer-term goal. Focus on maximizing THEO for this trip to get the best offers based on your current play level. Ensure you always use your player's card.`);
        }
    };


    return (
        <Card title="Comps & THEO" icon={<StarIcon />}>
            <p className="text-sm text-brand-subtle mb-4 font-sans">
                Maximize your casino rewards by tracking your theoretical loss (THEO) and player tier status.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs & Calcs */}
                <div>
                     <h3 className="font-semibold text-brand-secondary mb-2 font-sans text-lg">THEO Calculator & Tier Tracker</h3>
                    <div className="space-y-3 bg-brand-bg/50 p-4 rounded-lg">
                        <Input 
                            label="Current Player Tier" 
                            id="tier" 
                            type="text" 
                            value={tier} 
                            onChange={e => setTier(e.target.value)}
                            placeholder="e.g., Gold"
                        />
                        <Input 
                            label="Tier Credits to Next Level" 
                            id="pointsToNext" 
                            type="number" 
                            value={pointsToNext || ''} 
                            onChange={e => setPointsToNext(parseInt(e.target.value))}
                            placeholder="e.g., 250"
                        />
                        <Input 
                            label="Estimated House Edge (%)" 
                            id="houseEdge" 
                            type="number" 
                            value={houseEdge || ''} 
                            onChange={e => setHouseEdge(parseFloat(e.target.value))}
                        />
                    </div>
                     <div className="mt-4 grid grid-cols-2 gap-4 text-center bg-black/50 p-4 rounded-lg border border-brand-subtle/20">
                        <div>
                            <span className="text-sm text-brand-subtle block font-sans">Total Coin-In</span>
                            <span className="text-2xl font-bold text-brand-secondary font-mono">${coinIn.toFixed(2)}</span>
                        </div>
                         <div>
                            <span className="text-sm text-brand-subtle block font-sans">Your THEO</span>
                            <span className="text-2xl font-bold text-brand-secondary font-mono">${theo.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Optimizer */}
                 <div>
                     <h3 className="font-semibold text-brand-secondary mb-2 font-sans text-lg">Comp Optimizer</h3>
                     <div className="bg-brand-bg/50 p-4 rounded-lg h-full flex flex-col">
                        <Button onClick={generateSuggestion} className="w-full" variant="accent">Generate Comp Strategy</Button>
                        {suggestion && (
                            <div className="mt-4 text-sm text-brand-subtle bg-brand-bg p-3 rounded-md flex-grow">
                                <p className="text-brand-text font-sans">{suggestion}</p>
                            </div>
                        )}
                     </div>
                 </div>
            </div>
        </Card>
    );
};

export default Phase4_Comps;