"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** Animate a number counting up from `from` to `to` */
function useCountUp(to: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (to === 0) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * to));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [to, duration]);
  return value;
}

const features = [
  {
    icon: "🔍",
    title: "AI-Powered Analysis",
    description:
      "Instantly extract and analyze your resume data with advanced pattern recognition and NLP techniques.",
  },
  {
    icon: "📊",
    title: "ATS Score (0–100)",
    description:
      "Get a precise ATS compatibility score based on contact info, skills, projects, and keyword density.",
  },
  {
    icon: "⚡",
    title: "Section Breakdown",
    description:
      "Understand exactly which sections are strong and which need improvement with actionable feedback.",
  },
  {
    icon: "✨",
    title: "Make My Resume Super",
    description:
      "Generate an ATS-friendly optimized resume using a professional template with strong action verbs.",
  },
  {
    icon: "📄",
    title: "Download as PDF",
    description:
      "Get your optimized resume as a clean, professional PDF ready to submit to top companies.",
  },
  {
    icon: "🔒",
    title: "100% Private",
    description:
      "No data stored, no accounts needed. Everything is processed in memory and discarded after analysis.",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload Your Resume",
    description: "Upload your PDF resume (max 5MB). Drag and drop or browse.",
  },
  {
    step: "02",
    title: "Get Your ATS Score",
    description:
      "Our engine analyzes your resume and returns a detailed section-wise ATS score.",
  },
  {
    step: "03",
    title: "Optimize & Download",
    description:
      "Click the Make My Resume Super button to generate and download an ATS-optimized PDF.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const [resumeCount, setResumeCount] = useState(500);

  useEffect(() => {
    fetch("/api/counter")
      .then((r) => r.json())
      .then((d) => { if (d.count) setResumeCount(d.count); })
      .catch(() => {});
  }, []);

  const animatedCount = useCountUp(resumeCount);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #2563eb, transparent)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-1.5 rounded-full border border-blue-100 mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              AI-Powered Resume Analysis
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Beat the ATS.{" "}
            <span className="text-blue-600">Land the Interview.</span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upload your resume and get an instant ATS compatibility score,
            section-wise feedback, missing keywords, and a professionally
            optimized resume — all in seconds.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 hover:scale-105 active:scale-95"
            >
              🚀 Analyze My Resume Free
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-xl text-base border border-slate-200 hover:bg-slate-100 transition-all"
            >
              See How It Works
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-col sm:flex-row gap-8 justify-center mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {[
              { value: `${animatedCount.toLocaleString()}+`, label: "Resumes Analysed & Optimised", highlight: true },
              { value: "0–100", label: "ATS Score" },
              { value: "6", label: "Section Analysis" },
              { value: "40+", label: "Keyword Checks" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl font-black ${(stat as any).highlight ? "text-blue-600" : "text-slate-900"}`}>{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">
              Everything You Need to Get Hired
            </h2>
            <p className="text-slate-500 mt-3 text-base max-w-xl mx-auto">
              ResumeIQ gives you a complete resume intelligence suite — for free.
            </p>
          </div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-slate-800 text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">
              How It Works
            </h2>
            <p className="text-slate-500 mt-3 text-base">
              Three simple steps to an ATS-optimized resume.
            </p>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-emerald-400" />

            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-blue-200">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-600 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-black text-white mb-4">
              Ready to boost your ATS score?
            </h2>
            <p className="text-blue-100 text-base mb-8">
              Upload your resume now and get your personalized ATS report in
              seconds. No sign-up. No credit card. 100% free.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-base hover:bg-blue-50 transition-all shadow-lg hover:scale-105 active:scale-95"
            >
              ✨ Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
