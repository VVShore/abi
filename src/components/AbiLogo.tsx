import React from 'react';

interface AbiLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const AbiLogo: React.FC<AbiLogoProps> = ({
  className = '',
  size = 40,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Geometric Polyhedron Wireframe Mesh Icon matching https://sites.austincc.edu/incubator/ */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Wireframe connecting lines */}
        <line x1="50" y1="12" x2="22" y2="35" stroke="#78BE20" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="50" y1="12" x2="78" y2="35" stroke="#78BE20" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="35" x2="16" y2="70" stroke="#78BE20" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="78" y1="35" x2="84" y2="70" stroke="#78BE20" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="16" y1="70" x2="50" y2="92" stroke="#78BE20" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="84" y1="70" x2="50" y2="92" stroke="#78BE20" strokeWidth="2.5" strokeLinecap="round" />

        {/* Interior facets & cross connections */}
        <line x1="50" y1="12" x2="38" y2="52" stroke="#78BE20" strokeWidth="2" strokeDasharray="none" />
        <line x1="50" y1="12" x2="62" y2="52" stroke="#78BE20" strokeWidth="2" />
        <line x1="22" y1="35" x2="38" y2="52" stroke="#78BE20" strokeWidth="2" />
        <line x1="78" y1="35" x2="62" y2="52" stroke="#78BE20" strokeWidth="2" />
        <line x1="38" y1="52" x2="62" y2="52" stroke="#78BE20" strokeWidth="2.5" />
        <line x1="38" y1="52" x2="16" y2="70" stroke="#78BE20" strokeWidth="2" />
        <line x1="62" y1="52" x2="84" y2="70" stroke="#78BE20" strokeWidth="2" />
        <line x1="38" y1="52" x2="50" y2="92" stroke="#78BE20" strokeWidth="2" />
        <line x1="62" y1="52" x2="50" y2="92" stroke="#78BE20" strokeWidth="2" />
        <line x1="22" y1="35" x2="62" y2="52" stroke="#78BE20" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="78" y1="35" x2="38" y2="52" stroke="#78BE20" strokeWidth="1.2" strokeOpacity="0.4" />
        <line x1="16" y1="70" x2="84" y2="70" stroke="#78BE20" strokeWidth="1.2" strokeOpacity="0.4" />

        {/* Vertex Nodes (Dots) */}
        <circle cx="50" cy="12" r="4" fill="#78BE20" />
        <circle cx="22" cy="35" r="3.5" fill="#78BE20" />
        <circle cx="78" cy="35" r="3.5" fill="#78BE20" />
        <circle cx="16" cy="70" r="3.5" fill="#78BE20" />
        <circle cx="84" cy="70" r="3.5" fill="#78BE20" />
        <circle cx="50" cy="92" r="4" fill="#78BE20" />
        <circle cx="38" cy="52" r="3.5" fill="#78BE20" />
        <circle cx="62" cy="52" r="3.5" fill="#78BE20" />
      </svg>

      {showText && (
        <div className="flex flex-col tracking-tight leading-none select-none">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-slate-500 font-sans">
            Austin Community College
          </span>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#78BE20] leading-tight font-sans">
            BIOSCIENCE
          </span>
          <span className="text-sm sm:text-base font-extrabold tracking-wider text-[#431A4D] font-sans -mt-0.5">
            INCUBATOR
          </span>
        </div>
      )}
    </div>
  );
};
