// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React, { useState, useCallback, useRef } from 'react';
import type { MachineData, GroundingChunk } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { fetchRegionalOdds, analyzePaytableImage } from '../services/geminiService';
import ResultsCard from './ResultsCard';

interface Phase1Props {
  onSave: (data: MachineData) => void;
  jurisdiction: string;
  onJurisdictionChange: (jurisdiction: string) => void;
}

const CameraIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);

const GlobeAltIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0 0 12 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 0 3 12c0-.778.099 1.533.284-2.253m0 0A11.953 11.953 0 0 1 12 7.5c2.998 0 5.74 1.1 7.843 2.918" />
    </svg>
);

const jurisdictionsList = ["Nevada", "New Jersey", "Mississippi", "Pennsylvania", "Online/International"];

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            if (result) {
                resolve(result);
            } else {
                reject(new Error("Failed to convert file to base64."));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};


const Phase1_Data: React.FC<Phase1Props> = ({ onSave, jurisdiction, onJurisdictionChange }) => {
  const [machineData, setMachineData] = useState<MachineData>({
    gameName: '', vendor: '', denomination: 1.00, maxBet: 5.00
  });
  const [oddsAnalysis, setOddsAnalysis] = useState<{ analysis: string; sources: GroundingChunk[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMachineData(prev => ({ ...prev, [name]: name === 'denomination' || name === 'maxBet' ? parseFloat(value) : value }));
  };
  
  const handleSave = () => {
      onSave(machineData);
      alert('Machine data saved!');
  };

  const handleAnalyze = useCallback(async () => {
    if (!jurisdiction) return;
    setIsLoading(true);
    setOddsAnalysis(null);
    const result = await fetchRegionalOdds(jurisdiction);
    setOddsAnalysis(result);
    setIsLoading(false);
  }, [jurisdiction]);

  const handleImageScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsOcrLoading(true);
      try {
          const base64Data = await fileToBase64(file);
          const extractedData = await analyzePaytableImage({ data: base64Data, mimeType: file.type });
          
          setMachineData(prev => {
              const updated = { ...prev, ...extractedData };
              // Ensure numeric fields are numbers
              if (extractedData.denomination) updated.denomination = Number(extractedData.denomination);
              if (extractedData.maxBet) updated.maxBet = Number(extractedData.maxBet);
              return updated;
          });

      } catch (error) {
          alert(error instanceof Error ? error.message : "An unknown error occurred during image analysis.");
      } finally {
          setIsOcrLoading(false);
          // Reset file input to allow re-uploading the same file
          if(fileInputRef.current) fileInputRef.current.value = "";
      }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Machine Data Input">
        <p className="text-brand-subtle text-sm mb-4 font-sans">Enter machine details manually or scan the paytable with an image.</p>
        <div className="space-y-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageScan}
                className="hidden"
                accept="image/*"
            />
            <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isOcrLoading}
                variant="accent"
                className="w-full flex items-center justify-center gap-2"
            >
                {isOcrLoading ? <><Spinner /> Scanning...</> : "Scan Paytable Image"}
            </Button>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-brand-subtle/30"></div>
              <span className="flex-shrink mx-4 text-brand-subtle text-xs font-sans">OR ENTER MANUALLY</span>
              <div className="flex-grow border-t border-brand-subtle/30"></div>
            </div>
            <Input label="Game Name" id="gameName" name="gameName" value={machineData.gameName} onChange={handleInputChange} placeholder="e.g., Buffalo Gold" />
            <Input label="Manufacturer (Vendor)" id="vendor" name="vendor" value={machineData.vendor} onChange={handleInputChange} placeholder="e.g., Aristocrat" />
            <Input label="Denomination ($)" id="denomination" name="denomination" type="number" step="0.01" value={machineData.denomination} onChange={handleInputChange} />
            <Input label="Max Bet ($)" id="maxBet" name="maxBet" type="number" step="0.25" value={machineData.maxBet} onChange={handleInputChange} />
            <Button onClick={handleSave} className="w-full">Save Machine Data</Button>
        </div>
      </Card>
      
      <Card title="Regional Odds">
        <p className="text-brand-subtle text-sm mb-4 font-sans">Select gaming jurisdiction for an AI analysis of payback percentages (RTP).</p>
        <div className="flex flex-col sm:flex-row gap-4">
            <select
                name="jurisdiction"
                value={jurisdiction}
                onChange={(e) => onJurisdictionChange(e.target.value)}
                className="w-full bg-brand-bg border border-brand-subtle/50 rounded-md p-2.5 text-brand-text focus:ring-brand-secondary focus:border-brand-secondary font-mono"
            >
                <option value="">Select Jurisdiction...</option>
                {jurisdictionsList.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <Button onClick={handleAnalyze} disabled={!jurisdiction || isLoading} className="flex-shrink-0">Analyze</Button>
        </div>
        <div className="mt-4 min-h-[150px]">
          {(isLoading || oddsAnalysis) && (
              <ResultsCard
                isLoading={isLoading}
                title="Regional Odds Analysis"
                content={oddsAnalysis?.analysis || ''}
                sources={oddsAnalysis?.sources.filter(s => s.web).map(s => s.web as {uri: string; title: string}) || []}
              />
            )}
        </div>
      </Card>
    </div>
  );
};

export default Phase1_Data;