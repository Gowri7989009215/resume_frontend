"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AnalysisResult } from "@/lib/types";
import { MAX_FILE_SIZE_BYTES } from "@/lib/constants";

interface EnhancedFileUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

export default function EnhancedFileUpload({ onAnalysisComplete }: EnhancedFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size must be less than ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB`);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(progress);
        },
      });

      onAnalysisComplete(response.data);
      
      // Store analysis in sessionStorage for resume preview
      sessionStorage.setItem('resumeAnalysis', JSON.stringify(response.data));
      
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            ATS Resume Analyzer
          </h1>
          <p className="text-lg text-slate-600 mb-2">
            Upload your resume to get instant ATS score and professional improvements
          </p>
          <div className="flex justify-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF, DOCX
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Max {MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB
            </span>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          {!file ? (
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </motion.div>
              <div>
                <p className="text-lg font-semibold text-slate-700 mb-2">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-slate-500">
                  Support for PDF and DOCX files
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <div>
                <p className="text-lg font-semibold text-slate-700 mb-1">
                  {file.name}
                </p>
                <p className="text-sm text-slate-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove File
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Progress */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 space-y-3"
            >
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Analyzing resume...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: file && !isUploading ? 1.02 : 1 }}
            whileTap={{ scale: file && !isUploading ? 0.98 : 1 }}
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`px-8 py-3 rounded-xl font-semibold text-base transition-all shadow-md flex items-center gap-3 ${
              file && !isUploading
                ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 cursor-pointer"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing Resume...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Analyze Resume
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/resume-preview')}
            className="px-8 py-3 rounded-xl font-semibold text-base bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all shadow-md"
          >
            View Sample Resume
          </motion.button>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🎯",
              title: "ATS Score",
              description: "Get instant ATS compatibility score with detailed breakdown"
            },
            {
              icon: "🚀",
              title: "AI Enhancement",
              description: "Transform your resume with AI-powered improvements"
            },
            {
              icon: "📄",
              title: "Professional Format",
              description: "Download ATS-optimized PDF and DOCX formats"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="text-center p-4"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
