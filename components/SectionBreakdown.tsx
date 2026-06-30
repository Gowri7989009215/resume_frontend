"use client";

import { motion } from "framer-motion";
import { SectionScore } from "@/lib/types";
import AnimatedProgress from "./AnimatedProgress";
import { getScoreColor } from "@/lib/utils";

interface SectionBreakdownProps {
    sectionScores: SectionScore[];
}

export default function SectionBreakdown({
    sectionScores,
}: SectionBreakdownProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-md border border-slate-100 p-6"
        >
            <h2 className="text-lg font-bold text-slate-800 mb-5">
                Section Breakdown
            </h2>

            <div className="space-y-5">
                {sectionScores.map((section, i) => {
                    const color = getScoreColor(
                        Math.round((section.score / section.maxScore) * 100)
                    );

                    return (
                        <motion.div
                            key={section.name}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * i }}
                        >
                            <AnimatedProgress
                                value={section.score}
                                max={section.maxScore}
                                color={color}
                                label={section.name}
                                delay={0.15 * i}
                            />
                            {section.feedback && (
                                <p className="text-xs text-slate-500 mt-1 pl-0.5">
                                    {section.feedback}
                                </p>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
