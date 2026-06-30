"use client";

import { motion } from "framer-motion";

interface AnimatedProgressProps {
    value: number;
    max: number;
    color?: string;
    label?: string;
    delay?: number;
}

export default function AnimatedProgress({
    value,
    max,
    color = "#2563eb",
    label,
    delay = 0,
}: AnimatedProgressProps) {
    const percentage = Math.round((value / max) * 100);

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <span className="text-sm font-semibold" style={{ color }}>
                        {value}/{max}
                    </span>
                </div>
            )}
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.9, ease: "easeOut", delay }}
                />
            </div>
        </div>
    );
}
