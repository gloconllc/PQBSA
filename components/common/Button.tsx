// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = "px-6 py-3 font-sans rounded-md text-lg uppercase tracking-wider transition-all duration-200 border-2 transform focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "border-brand-primary text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 hover:shadow-glow-primary",
    secondary: "border-brand-subtle text-brand-subtle bg-brand-subtle/10 hover:bg-brand-subtle/20",
    accent: "border-brand-secondary text-brand-secondary bg-brand-secondary/10 hover:bg-brand-secondary/20 hover:shadow-glow-secondary"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;