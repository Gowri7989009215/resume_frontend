"use client";

import { useState } from "react";
import { UploadCloud, FileText, Loader2, AlertCircle } from "lucide-react";

interface UploadPageProps {
    onAnalyzeComplete: (data: any) => void;
}

export default function UploadPage({ onAnalyzeComplete }: UploadPageProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        handleFileSelection(files[0]);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelection(files[0]);
        }
    };

    const handleFileSelection = (selectedFile: File) => {
        setError(null);
        if (selectedFile?.type !== "application/pdf") {
            setError("Only PDF files are currently supported.");
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append("resume", file);

            // Import dynamically to avoid SSR issues
            const pdfjsLib = await import('pdfjs-dist');
            const Tesseract = (await import('tesseract.js')).default;
            
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

            let ocrText = "";
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
            const pdf = await loadingTask.promise;
            
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
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
            
            const res = await fetch("/api/analyze", {
                method: "POST",
                body: formData,
            });
            
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "Analysis failed");
            
            onAnalyzeComplete(data);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "An error occurred during upload or OCR processing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 w-full max-w-3xl mx-auto">
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                    AI ATS <span className="text-blue-600">Resume Analyzer</span>
                </h1>
                <p className="text-lg text-gray-600">
                    Upload your resume to get an instant ATS score and AI-powered recommendations.
                </p>
            </div>

            <div 
                className={`w-full p-12 border-4 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center bg-white shadow-sm ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {file ? (
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileText size={40} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800 text-xl">{file.name}</p>
                            <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button 
                                onClick={() => setFile(null)} 
                                className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Remove
                            </button>
                            <button 
                                onClick={handleUpload} 
                                disabled={loading}
                                className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                                {loading ? 'Analyzing...' : 'Analyze Resume'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-6">
                        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <UploadCloud size={48} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-semibold text-gray-800">Drag & drop your resume here</h3>
                            <p className="text-gray-500 mt-2">or, click to select a file</p>
                        </div>
                        <input 
                            type="file" 
                            id="file-upload" 
                            className="hidden" 
                            accept=".pdf"
                            onChange={handleFileInput}
                        />
                        <label 
                            htmlFor="file-upload"
                            className="px-8 py-3 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all shadow-md cursor-pointer"
                        >
                            Select from Computer
                        </label>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 w-full border border-red-100 animate-in fade-in slide-in-from-bottom-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}
            
            <div className="mt-12 w-full max-w-lg mx-auto">
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500">Supported Format</p>
                        <p className="font-semibold text-gray-800">PDF Document</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500">Maximum Size</p>
                        <p className="font-semibold text-gray-800">5 MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
