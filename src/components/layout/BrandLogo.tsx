import React from 'react';

/** Logo rasmi LogKerja (public/icon.svg). Saiz dikawal melalui className, contoh "w-8 h-8". */
export const BrandLogo: React.FC<{ className?: string; decorative?: boolean }> = ({ className = 'w-8 h-8', decorative = true }) => (
    <img
        src="/icon.svg"
        alt={decorative ? '' : 'LogKerja'}
        aria-hidden={decorative ? true : undefined}
        className={`shrink-0 select-none ${className}`}
        draggable={false}
    />
);

export default BrandLogo;
