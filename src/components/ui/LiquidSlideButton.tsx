'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'danger' | 'warning' | 'success' | 'outline';
}

export function LiquidSlideButton({ children, className, variant = 'primary', ...props }: ButtonProps) {
    const baseColors = {
        primary: 'bg-indigo-600 text-white border-transparent',
        danger: 'bg-rose-500 text-white border-transparent',
        warning: 'bg-amber-500 text-white border-transparent',
        success: 'bg-emerald-500 text-white border-transparent',
        outline: 'bg-transparent text-white border border-white/20 hover:border-white/40'
    };

    const slideColors = {
        primary: 'bg-indigo-700',
        danger: 'bg-rose-600',
        warning: 'bg-amber-600',
        success: 'bg-emerald-600',
        outline: 'bg-white/10'
    };

    return (
        <button
            className={cn(
                "relative overflow-hidden group px-6 py-2.5 rounded-full font-medium tracking-wide transition-all duration-300 border",
                baseColors[variant],
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            <motion.div
                className={cn(
                    "absolute inset-0 z-0 scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-x-100",
                    slideColors[variant]
                )}
            />
        </button>
    );
}
