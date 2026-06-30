"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";

type Step = "email" | "otp" | "password" | "success";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset code");
        return;
      }

      setMessage("Reset code sent to your email");
      setStep("otp");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to verify reset code");
        return;
      }

      setMessage("Code verified. Enter your new password.");
      setStep("password");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setStep("success");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1800);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-center text-2xl">
              {step === "password" ? "Change Password" : "Forgot Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {step === "password"
                ? "Enter a new password for your ResumeIQ account"
                : "We will send a reset code to your email"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-200 text-sm"
              >
                {message}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.form
                  key="email"
                  onSubmit={handleSendOTP}
                  className="space-y-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending code...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </Button>
                </motion.form>
              )}

              {step === "otp" && (
                <motion.form
                  key="otp"
                  onSubmit={handleVerifyOTP}
                  className="space-y-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter Reset Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Check your email for the 6-digit code
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep("email")}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </motion.form>
              )}

              {step === "password" && (
                <motion.form
                  key="password"
                  onSubmit={handleResetPassword}
                  className="space-y-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating password...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </motion.form>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  className="text-center space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto"
                  >
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Password Changed</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Redirecting you to sign in...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step !== "success" && (
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Remember your password?{" "}
                <Link
                  href="/auth/signin"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
