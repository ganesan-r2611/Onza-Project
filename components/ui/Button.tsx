'use client';
import React, { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'gradient';
type Size = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // design-specific props
  variant?: Variant;
  size?: Size;

  // "visual" props (from your original list)
  text?: string;
  text_font_size?: string;       // tailwind class or custom (e.g. 'text-sm' or '14px')
  text_font_family?: string;     // either Tailwind font class like 'font-medium' or a font-family string
  text_font_weight?: string;     // tailwind weight class like 'font-semibold'
  text_line_height?: string;     // tailwind line-height class like 'leading-5'
  text_text_align?: 'left' | 'center' | 'right' | string;
  text_color?: string;           // tailwind class like 'text-white' or any CSS color if used in styles

  border_border_radius?: string; // tailwind rounded class or custom (e.g. 'rounded-md' or '6px')
  border_border?: string;        // CSS border string (e.g. '1px solid #ddd')

  fill_background?: string;      // used to detect gradient or inline background CSS
  fill_background_color?: string;// explicit backgroundColor (CSS)
  border_border_image?: string;

  effect_box_shadow?: string;    // CSS box-shadow string or tailwind shadow class
  text_text_transform?: string;  // e.g. 'uppercase'
  layout_width?: string;         // '100px' or 'w-full' etc
  padding?: string;              // '10px 16px' or tailwind 'px-4 py-2'
  position?: string;
  margin?: string;

  children?: ReactNode;
}

const variantToClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-300',
  outline: 'bg-transparent border-2 border-gray-300 hover:bg-gray-50 text-gray-900 focus:ring-gray-300',
  gradient: 'bg-gradient-to-r from-yellow-300 to-yellow-100 text-gray-900 hover:opacity-95 focus:ring-yellow-300'
}

const sizeToClasses: Record<Size, string> = {
  small: 'text-xs px-3 py-1.5',
  medium: 'text-sm px-4 py-2',
  large: 'text-base px-6 py-3',
}

function safeTailwindOrRaw(value?: string, prefix = '') {
  if (!value) return '';
  if (/^[a-zA-Z0-9\-\_]+$/.test(value) || value.startsWith('text') || value.startsWith('font') || value.startsWith('leading') || value.startsWith('rounded') || value.startsWith('shadow')) {
    return prefix + value;
  }
  return '';
}

const Button: React.FC<ButtonProps> = ({
  // defaults
  text = 'Button',
  text_font_size = 'text-xs',
  text_font_family = 'Hanken Grotesk',
  text_font_weight = 'font-normal',
  text_line_height = 'leading-none',
  text_text_align = 'left',
  text_color = 'text-secondary-light',
  border_border_radius = 'rounded-sm',
  border_border,
  fill_background = '',
  effect_box_shadow = '',

  fill_background_color,
  border_border_image,
  text_text_transform,
  layout_width,
  padding,
  position,
  margin,

  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  const inlineStyles: CSSProperties = {};

  if (text_font_family && !text_font_family.startsWith('font-')) {
    inlineStyles.fontFamily = text_font_family;
  }

  if (fill_background && (fill_background.includes('gradient') || fill_background.includes('linear-gradient'))) {
    inlineStyles.background = fill_background.includes('linear-gradient') ? fill_background : 'linear-gradient(134deg, #ffdc81 0%, #ffeec0 100%)';
  }

  if (fill_background_color) {
    inlineStyles.backgroundColor = fill_background_color;
  }

  if (effect_box_shadow && !effect_box_shadow.startsWith('shadow')) {
    inlineStyles.boxShadow = effect_box_shadow;
  }

  if (border_border && (border_border.includes('px') || border_border.includes('solid') || border_border.includes('dashed'))) {
    inlineStyles.border = border_border;
  }

  if (layout_width && (layout_width.includes('px') || layout_width.endsWith('%') || layout_width === 'auto')) {
    inlineStyles.width = layout_width;
  }
  if (padding && (padding.includes('px') || padding.includes('rem') || padding.includes('%'))) {
    inlineStyles.padding = padding;
  }
  if (margin && (margin.includes('px') || margin.includes('%') || margin.includes('rem'))) {
    inlineStyles.margin = margin;
  }
  if (position) {
    inlineStyles.position = position as any;
  }

  const baseClasses = [
    'inline-flex', 'items-center', 'justify-center', 'font-medium',
    'transition-all', 'duration-200', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2',
    'disabled:opacity-50', 'disabled:cursor-not-allowed',
  ];

  baseClasses.push(variantToClasses[variant]);
  baseClasses.push(sizeToClasses[size]);

  const tailwindExtras = [
    safeTailwindOrRaw(text_font_size),
    text_font_weight,
    text_line_height,
    typeof text_text_align === 'string' && (['left','center','right','justify'].includes(text_text_align) ? `text-${text_text_align}` : text_text_align),
    text_color,
    border_border_radius,
    effect_box_shadow && effect_box_shadow.startsWith('shadow') ? effect_box_shadow : '',
    text_text_transform && (text_text_transform === 'uppercase' || text_text_transform === 'lowercase' || text_text_transform === 'capitalize' ? text_text_transform : ''),
  ].filter(Boolean) as string[];

  const finalClassName = [...baseClasses, ...tailwindExtras, className].filter(Boolean).join(' ').trim();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      style={inlineStyles}
      className={finalClassName}
      aria-disabled={disabled}
      {...props}
    >
      {children ?? text}
    </button>
  );
};

export default Button;
