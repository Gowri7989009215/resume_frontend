"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const { data: session, status } = useSession();
    
    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm"
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md group-hover:shadow-blue-200 transition-shadow">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-slate-900">
                        Resume<span className="text-blue-600">IQ</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                    >
                        Home
                    </Link>
                    {session && (
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}

                    {status === "loading" ? (
                        <div className="h-9 w-24 bg-slate-200 rounded-lg animate-pulse" />
                    ) : status === "authenticated" && session?.user ? (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signin">
                                <Button size="sm" variant="ghost">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/upload" className="hidden sm:block">
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    Analyze Resume
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </motion.header>
    );
}
