'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Layers } from 'lucide-react';

export function CinematicGlassNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
                scrolled
                    ? "bg-black/40 backdrop-blur-xl border-white/10 py-3 shadow-2xl"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Layers className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                        Excel<span className="text-indigo-400">Flow</span>
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                    <a href="#" className="hover:text-white transition-colors duration-300">Dashboard</a>
                    <a href="#" className="hover:text-white transition-colors duration-300">Historial</a>
                    <a href="#" className="hover:text-white transition-colors duration-300">Ajustes</a>
                </nav>
            </div>
        </header>
    );
}
