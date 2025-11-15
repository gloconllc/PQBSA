// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState } from 'react';
import { LightBulbIcon } from './icons/LightBulbIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { LinkIcon } from './icons/LinkIcon';

interface GroundingSource {
  uri: string;
  title: string;
}

interface ResultsCardProps {
  title: string;
  content: string;
  sources?: GroundingSource[];
  isLoading?: boolean;
}

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-brand-surface/50 animate-pulse rounded-md ${className}`}></div>
);


const ResultsCard: React.FC<ResultsCardProps> = ({ title, content, sources, isLoading }) => {
    const [isSourcesExpanded, setIsSourcesExpanded] = useState(false);

    const getHostname = (uri: string) => {
        try {
            return new URL(uri).hostname;
        } catch (error) {
            return uri;
        }
    };

    if (isLoading) {
        return (
            <div className="bg-brand-surface border border-brand-primary/30 rounded-lg p-6 animate-fade-in shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <SkeletonLoader className="h-8 w-8 rounded-full" />
                    <SkeletonLoader className="h-7 w-2/3" />
                </div>
                <div className="space-y-2">
                    <SkeletonLoader className="h-4 w-full" />
                    <SkeletonLoader className="h-4 w-full" />
                    <SkeletonLoader className="h-4 w-5/6" />
                </div>
            </div>
        );
    }
  
    return (
    <div className="bg-brand-surface border border-brand-primary/30 rounded-lg p-6 animate-fade-in shadow-lg transition-all hover:shadow-glow-primary">
      <div className="flex items-center gap-3 mb-4">
        <LightBulbIcon className="w-8 h-8 text-brand-accent" />
        <h2 className="text-2xl font-serif font-bold text-brand-accent tracking-wider">{title}</h2>
      </div>

      <p className="text-brand-text whitespace-pre-wrap leading-relaxed font-sans">{content}</p>
      
      {sources && sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-brand-subtle/30">
            <button
                onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
                className="w-full flex justify-between items-center text-left text-brand-text hover:text-brand-primary transition-colors"
                aria-expanded={isSourcesExpanded}
                aria-controls="sources-panel"
            >
                <span className="text-lg font-semibold font-sans">
                    Sources ({sources.length})
                </span>
                <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isSourcesExpanded ? 'rotate-180' : ''}`} />
            </button>
            <div
                id="sources-panel"
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isSourcesExpanded ? 'max-h-96 mt-4' : 'max-h-0'}`}
            >
                <ul className="space-y-3">
                    {sources.map((source, index) => (
                        <li key={index} className="flex items-start gap-3 bg-black/30 p-3 rounded-md">
                            <LinkIcon className="w-5 h-5 text-brand-subtle flex-shrink-0 mt-1" />
                            <div>
                                <a 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-brand-primary hover:underline font-semibold"
                                    aria-label={`Read more about ${source.title || 'this source'}`}
                                >
                                    {source.title || 'Untitled Source'}
                                </a>
                                <p className="text-xs text-brand-subtle truncate">{getHostname(source.uri)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultsCard;