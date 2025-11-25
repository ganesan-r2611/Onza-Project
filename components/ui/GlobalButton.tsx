// components/GlobalButton.tsx
import React from 'react';
import Link from 'next/link';

interface GlobalButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
  paddingX?: number | string;
  paddingY?: number | string;
  fontSize?: number | string;
  lineHeight?: number | string;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const GlobalButton: React.FC<GlobalButtonProps> = ({
  children,
  href,
  onClick,
  width,
  height,
  paddingX = '32px',
  paddingY = '16px',
  fontSize = '20px',
  lineHeight = '24px',
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}) => {
  // Convert values to responsive units
  const getResponsiveValue = (value: number | string): string => {
    if (typeof value === 'string') {
      if (value.includes('vw') || value.includes('rem') || value.includes('%') || value === 'auto' || value === 'normal') {
        return value;
      }
      const pxValue = parseFloat(value);
      if (!isNaN(pxValue)) {
        return `clamp(${pxValue * 0.7}px, ${(pxValue / 1440) * 100}vw, ${pxValue}px)`;
      }
      return value;
    }
    const min = value * 0.7;
    const max = value;
    return `clamp(${min}px, ${(value / 1440) * 100}vw, ${max}px)`;
  };

  // Use inline-block and w-full when no width is specified
  const containerClass = width ? 'inline-block' : 'block w-full';

  const wrapperStyle = {
    width: width ? getResponsiveValue(width) : '100%',
    height: height ? getResponsiveValue(height) : '100%',
  };

  const innerStyle = {
    width: '100%',
    height: '100%',
    padding: `${getResponsiveValue(paddingY)} ${getResponsiveValue(paddingX)}`,
    fontSize: getResponsiveValue(fontSize),
    lineHeight: getResponsiveValue(lineHeight),
  };

  // Primary variant - Outer wrapper (gradient border)
  const primaryGradientWrapper = `
    p-0.5 rounded-[112px]
    bg-[#0a5060]
    transition-all duration-500
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
  `;

  // Secondary variant with radial gradient
  const secondaryWrapper = `
    rounded-[24px]
    border border-[rgba(255,255,255,0.20)]
    transition-all duration-500
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:bg-[#0a5060]'}
  `;

  // Primary inner button
  const primaryInnerButton = `
    rounded-[163px]
    flex items-center justify-center
    text-[#F2E9DA] font-normal font-['Hanken_Grotesk']
    text-center
    [text-shadow:_0px_0px_8.7px_#000]
    transition-all duration-300
    ${disabled ? '' : 'hover:brightness-110'}
    ${className}
  `;

  // Secondary inner button with radial gradient background
  const secondaryInnerButton = `
    rounded-[24px]
    flex items-center justify-center
    text-[#FBFBFB] font-light font-['Hanken_Grotesk']
    text-center
    transition-all duration-300
    ${disabled ? '' : 'hover:bg-[#0a5060] hover:text-[#F2E9DA]'}
    ${className}
  `;

  // Radial gradient background for secondary variant
  const secondaryRadialGradient = `
    radial-gradient(at left bottom, rgba(255, 220, 129, 0.2), rgba(61, 194, 204, 0.2)),
    rgba(60, 194, 204, 0.20)
  `;

  const getWrapperClass = () => {
    return variant === 'primary' ? primaryGradientWrapper : secondaryWrapper;
  };

  const getInnerClass = () => {
    return variant === 'primary' ? primaryInnerButton : secondaryInnerButton;
  };

  const getBackgroundStyle = () => {
    if (variant === 'secondary') {
      return {
        background: secondaryRadialGradient,
      };
    }
    return {};
  };

  const content = (
<div 
  // className={getWrapperClass()} 
  style={{
    ...wrapperStyle,
    borderRadius: '1.67vw',
    background: `
      radial-gradient(204.35% 175.67% at 117.4% 119.32%, 
        rgba(255, 220, 129, 0.20) 0%, 
        rgba(255, 220, 129, 0.20) 10.81%, 
        rgba(255, 220, 129, 0.20) 17.22%, 
        rgba(10, 80, 96, 0.20) 30.84%, 
        rgba(40, 160, 170, 0.20) 42.1%, 
        rgba(10, 80, 96, 0.20) 50.04%, 
        rgba(10, 80, 96, 0.20) 58.36%, 
        rgba(10, 80, 96, 0.20) 67.44%, 
        rgba(10, 80, 96, 0.20) 75.14%, 
        rgba(10, 80, 96, 0.20) 82.91%, 
        rgba(255, 220, 129, 0.06) 89.86%, 
        rgba(255, 220, 129, 0.06) 97.12%),
      radial-gradient(118.91% 149.58% at -5.8% 90.91%, 
        rgba(255, 220, 129, 0.20) 0%, 
        rgba(10, 80, 96, 0.20) 18.12%, 
        rgba(10, 80, 96, 0.20) 29.81%, 
        rgba(10, 80, 96, 0.20) 38.46%, 
        rgba(10, 80, 96, 0.20) 47.6%, 
        rgba(10, 80, 96, 0.20) 55.29%, 
        rgba(10, 80, 96, 0.20) 62.98%, 
        rgba(10, 80, 96, 0.20) 69.71%, 
        rgba(40, 160, 170, 0.20) 76.92%, 
        rgba(40, 160, 170, 0.20) 83.65%, 
        rgba(40, 160, 170, 0.20) 90.38%, 
        rgba(255, 220, 129, 0.20) 97.12%),
      #0A5060
    `,
    boxShadow: '0 -3px 3.3px 1px #3CC2CC inset',
  }}
  

    >
      <div className={getInnerClass()} style={innerStyle}>
        {children}
      </div>
    </div>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={containerClass}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={containerClass}
    >
      {content}
    </button>
  );
};

export default GlobalButton;