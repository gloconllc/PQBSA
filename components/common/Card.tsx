// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, title, icon }) => {
  return (
    <div className={`bg-brand-surface border border-brand-primary/30 rounded-lg shadow-lg backdrop-blur-sm p-4 sm:p-6 ${className}`}>
      {title && (
        icon ? (
          <div className="flex items-center gap-3 mb-4">
            {icon}
            <h2 className="text-2xl font-bold text-brand-primary tracking-widest">{title}</h2>
          </div>
        ) : (
          <h2 className="text-2xl font-bold text-brand-primary tracking-widest mb-4">{title}</h2>
        )
      )}
      <div className="space-y-4 text-brand-text">
        {children}
      </div>
    </div>
  );
};

export default Card;