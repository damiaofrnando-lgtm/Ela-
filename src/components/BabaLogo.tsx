import React from 'react';

interface BabaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  theme?: 'dark' | 'light';
  className?: string;
}

export const BabaLogo: React.FC<BabaLogoProps> = ({
  size = 'md',
  showSlogan = true,
  theme = 'light',
  className = ''
}) => {
  const iconSize = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  }[size];

  const sloganSize = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Alibaba-inspired Emblem Badge */}
      <div className={`${iconSize} relative shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] via-[#FF5000] to-[#E03A00] shadow-md shadow-orange-500/25 p-1.5`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
          {/* Shopping Cart outline merged with Letter B */}
          <path
            d="M12 22H24L36 64H82L90 32H28"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bold Trade 'B' Inside */}
          <path
            d="M42 32H64C70 32 74 35 74 39C74 43 70 46 64 46H42V32Z"
            fill="#FFFFFF"
          />
          <path
            d="M42 46H67C73 46 78 50 78 55C78 60 73 64 67 64H42V46Z"
            fill="#FFFFFF"
          />
          {/* Inner negative cutouts of B */}
          <rect x="50" y="36" width="9" height="5" rx="2" fill="#FF5500" />
          <rect x="50" y="51" width="11" height="6" rx="2" fill="#FF5500" />
          {/* Smiling Trade Swoosh */}
          <path
            d="M32 78C48 88 68 88 84 78"
            stroke="#FFFFFF"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Wheels */}
          <circle cx="40" cy="74" r="5" fill="#FFFFFF" />
          <circle cx="76" cy="74" r="5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Wordmark & Alibaba-style Tagline */}
      <div className="flex flex-col justify-center leading-none">
        <div className={`font-black tracking-tight flex items-baseline gap-1 ${textSize}`}>
          <span className={theme === 'dark' ? 'text-white' : 'text-neutral-900'}>BABA</span>
          <span className="text-[#FF6A00] font-extrabold tracking-normal">.AO</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-[#FF5000] ml-1 hidden sm:inline-block border border-orange-200">
            Shopping
          </span>
        </div>
        {showSlogan && (
          <div className={`font-semibold tracking-wider text-neutral-500 mt-0.5 flex items-center gap-1.5 ${sloganSize}`}>
            <span className="text-neutral-700 font-bold hover:text-[#FF6A00] transition-colors">Compra</span>
            <span className="text-neutral-300">·</span>
            <span className="text-neutral-700 font-bold hover:text-[#FF6A00] transition-colors">Revende</span>
            <span className="text-neutral-300">·</span>
            <span className="text-[#FF6A00] font-black">Ganha</span>
          </div>
        )}
      </div>
    </div>
  );
};
