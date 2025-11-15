// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';
import Button from './common/Button';
import ResultsCard from './ResultsCard';
import type { GroundingChunk } from '../types';

interface IntelModalProps {
  onClose: () => void;
  isLoading: boolean;
  data: { analysis: string; sources: GroundingChunk[] } | null;
}

const IntelModal: React.FC<IntelModalProps> = ({ onClose, isLoading, data }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-brand-surface rounded-lg shadow-2xl max-w-2xl w-full p-6 border-2 border-brand-secondary/50 shadow-glow-secondary">
                <h2 className="text-3xl font-serif text-brand-secondary tracking-widest mb-4">Live Intel Update</h2>
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <ResultsCard
                        isLoading={isLoading}
                        title="Real-Time Regional Analysis"
                        content={data?.analysis || ''}
                        sources={data?.sources.filter(s => s.web).map(s => s.web as {uri: string; title: string}) || []}
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={onClose} variant="secondary">Close</Button>
                </div>
            </div>
        </div>
    );
};

export default IntelModal;