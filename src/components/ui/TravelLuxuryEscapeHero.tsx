'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function TravelLuxuryEscapeHero({
    title = "Gestión de Inventario",
    subtitle = "Optimiza, organiza y exporta tus recursos al instante"
}: {
    title?: string,
    subtitle?: string
}) {
    return (
        <div className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden bg-[#030305]">
            {/* Background Gradients */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/40 blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-900/30 blur-[120px]" />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"
                    style={{ backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#a5b4fc]">
                        Sistema Inteligente
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-xl text-zinc-400 font-light max-w-2xl leading-relaxed drop-shadow-sm"
                >
                    {subtitle}
                </motion.p>
            </div>

            {/* Decorative gradient line at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        </div>
    );
}
