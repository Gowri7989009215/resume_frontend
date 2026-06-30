"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AnalysisResult } from "@/lib/types";
import { MAX_FILE_SIZE_BYTES } from "@/lib/constants";

interface FileUploadProps {
    onAnalysisComplete?: (result: AnalysisResult) => void;
}

export default function FileUpload({ onAnalysisComplete }: FileUploadProps) {
    const router = useRouter();
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        const validTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/msword" // .doc
        ];
        
        if (!validTypes.includes(file.type)) {
            return "Only PDF, DOCX, and DOC files are accepted.";
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            return `File size must be under 10MB. Current: ${(file.size / (1024 * 1024)).toFixed(1)}MB`;
        }
        return null;
    };

    const handleFile = useCallback((file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            setSelectedFile(null);
            return;
        }
        setError(null);
        setSelectedFile(file);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError(null);
        setProgress(5);

        try {
            const formData = new FormData();
            formData.append("resume", selectedFile);

            if (selectedFile.type === "application/pdf") {
                setProgress(10);
                const pdfjsLib = await import('pdfjs-dist');
                const Tesseract = (await import('tesseract.js')).default;
                
                pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

                let ocrText = "";
                const arrayBuffer = await selectedFile.arrayBuffer();
                const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
                const pdf = await loadingTask.promise;
                
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    setProgress(10 + Math.round((pageNum / pdf.numPages) * 20)); // OCR progress 10 to 30
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.5 });
                    
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    if (context) {
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        
                        await page.render({ canvasContext: context, viewport } as any).promise;
                        
                        const dataUrl = canvas.toDataURL("image/png");
                        const { data: { text } } = await Tesseract.recognize(dataUrl, 'eng');
                        ocrText += text + "\n\n";
                    }
                }
                
                formData.append("ocrText", ocrText);
            }

            setProgress(30);

            const response = await axios.post<AnalysisResult>(
                "/api/analyze",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (e) => {
                        const pct = e.total ? Math.round((e.loaded / e.total) * 40) : 0;
                        setProgress(30 + pct);
                    },
                }
            );

            setProgress(90);
            const result = response.data;

            // Store in session storage to pass to results page
            sessionStorage.setItem("resumeAnalysis", JSON.stringify(result));
            setProgress(100);

            if (onAnalysisComplete) {
                onAnalysisComplete(result);
            }

            setTimeout(() => {
                router.push("/results");
            }, 300);
        } catch (err: unknown) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : "Analysis failed. Please try again.";
            setError(message);
            setIsLoading(false);
            setProgress(0);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Drop Zone */}
            <motion.div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                animate={{
                    borderColor: isDragOver
                        ? "#2563eb"
                        : selectedFile
                            ? "#10b981"
                            : "#cbd5e1",
                    backgroundColor: isDragOver
                        ? "#eff6ff"
                        : selectedFile
                            ? "#f0fdf4"
                            : "#f8fafc",
                    scale: isDragOver ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="relative border-2 border-dashed rounded-2xl p-10 cursor-pointer flex flex-col items-center gap-4 text-center transition-all"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleInputChange}
                    id="resume-input"
                />

                <motion.div
                    animate={{ scale: isDragOver ? 1.15 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${selectedFile
                            ? "bg-emerald-500"
                            : isDragOver
                                ? "bg-blue-600"
                                : "bg-blue-100"
                        }`}
                >
                    {selectedFile ? (
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className={`w-8 h-8 ${isDragOver ? "text-white" : "text-blue-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    )}
                </motion.div>

                {selectedFile ? (
                    <div>
                        <p className="font-semibold text-emerald-700">{selectedFile.name}</p>
                        <p className="text-sm text-emerald-500 mt-1">
                            {(selectedFile.size / 1024).toFixed(1)} KB · Ready to analyze
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="font-semibold text-slate-700">
                            Drop your resume here or{" "}
                            <span className="text-blue-600 underline underline-offset-2">browse</span>
                        </p>
                        <p className="text-sm text-slate-400 mt-1">PDF only · Max 5MB</p>
                    </div>
                )}
            </motion.div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress bar */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-4"
                    >
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Analyzing resume…</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Analyze Button */}
            <motion.button
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
                whileHover={{ scale: selectedFile && !isLoading ? 1.02 : 1 }}
                whileTap={{ scale: selectedFile && !isLoading ? 0.98 : 1 }}
                className={`mt-5 w-full py-3.5 rounded-xl font-semibold text-base transition-all shadow-md ${selectedFile && !isLoading
                        ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Analyzing…
                    </span>
                ) : (
                    "🔍 Analyze My Resume"
                )}
            </motion.button>
        </div>
    );
}
