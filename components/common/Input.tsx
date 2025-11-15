// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, id, ...props }, ref) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-sans tracking-wider text-brand-subtle mb-2">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className="w-full bg-black/30 border-2 border-brand-subtle/50 rounded-md p-3 text-brand-text placeholder-brand-subtle/50 focus:ring-0 focus:border-brand-primary focus:shadow-glow-primary transition-shadow duration-200 font-mono text-lg"
        {...props}
      />
    </div>
  );
});

export default Input;