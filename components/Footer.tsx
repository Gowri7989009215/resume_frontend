"use client";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 mt-auto">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                            <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <span className="font-bold text-slate-800">
                            Resume<span className="text-blue-600">IQ</span>
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 text-center">
                        AI-powered resume analysis. No data stored. 100% private.
                    </p>

                    <p className="text-sm text-slate-400">
                        © {new Date().getFullYear()} ResumeIQ. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
