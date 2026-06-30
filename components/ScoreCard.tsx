"use client";

import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/lib/utils";

interface ScoreCardProps {
    score: number;
}

export default function ScoreCard({ score }: ScoreCardProps) {
    const color = getScoreColor(score);
    const label = getScoreLabel(score);

    // SVG circle parameters
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center bg-white rounded-2xl shadow-md border border-slate-100 p-8"
        >
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">
                ATS Score
            </h2>

            <div className="relative w-44 h-44">
                <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 176 176"
                >
                    {/* Background track */}
                    <circle
                        cx="88"
                        cy="88"
                        r={radius}
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                    />
                    {/* Animated progress */}
                    <motion.circle
                        cx="88"
                        cy="88"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                    />
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className="text-4xl font-black"
                        style={{ color }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs font-medium text-slate-400">/100</span>
                </div>
            </div>

            <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
            >
                <span
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm"
                    style={{ backgroundColor: color }}
                >
                    {label}
                </span>
                <p className="text-xs text-slate-400 mt-3 max-w-[200px]">
                    {score >= 80
                        ? "Your resume is well-optimized for ATS systems."
                        : score >= 60
                            ? "Your resume has good potential. A few improvements can boost your score."
                            : score >= 40
                                ? "Your resume needs significant improvements to pass ATS filters."
                                : "Your resume needs a complete overhaul to be ATS-friendly."}
                </p>
            </motion.div>
        </motion.div>
    );
}
