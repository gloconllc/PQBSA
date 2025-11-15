// © 2024 Wilton John Picou, III of GloCon Solutions, LLC. All Rights Reserved.
// This code is the proprietary intellectual property of Wilton John Picou, III and GloCon Solutions, LLC.
// Unauthorized copying, distribution, or use of this code, in whole or in part, is strictly prohibited.

import React from 'react';

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-6 h-6"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a2.499 2.499 0 0 1-3.75 0M14.25 18v-.102a3.375 3.375 0 0 0-1.125-2.281l-2.437-2.437a3.375 3.375 0 0 0-2.281-1.125V6.75A4.5 4.5 0 0 1 12 2.25a4.5 4.5 0 0 1 4.5 4.5v3.375c0 .621-.125 1.223-.356 1.784l-2.437 2.437a3.375 3.375 0 0 0-1.125 2.281V18Z"
    />
  </svg>
);