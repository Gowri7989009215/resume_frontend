import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Utility helpers for ResumeIQ

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Normalize score to 0-100 range
 */
export function normalizeScore(score: number, max: number): number {
    return clamp(Math.round((score / max) * 100), 0, 100);
}

/**
 * Get score color class based on score value
 */
export function getScoreColor(score: number): string {
    if (score >= 80) return "#10b981"; // green
    if (score >= 60) return "#f59e0b"; // amber
    if (score >= 40) return "#f97316"; // orange
    return "#ef4444"; // red
}

/**
 * Get score label based on score value
 */
export function getScoreLabel(score: number): string {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
}

/**
 * Clean and normalize text
 */
export function cleanText(text: string): string {
    return text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\t/g, " ")
        .replace(/ {2,}/g, " ")
        .trim();
}

/**
 * Extract lines from text
 */
export function extractLines(text: string): string[] {
    return text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
}

/**
 * Check if a line contains any of the given keywords (case-insensitive)
 */
export function lineContainsKeywords(
    line: string,
    keywords: string[]
): boolean {
    const lowerLine = line.toLowerCase();
    return keywords.some((kw) => lowerLine.includes(kw.toLowerCase()));
}

/**
 * Format bytes to human readable size
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Generate a short unique ID
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Convert text to title case
 */
export function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
}

/**
 * Deduplicate array of strings (case-insensitive)
 */
export function deduplicate(arr: string[]): string[] {
    const seen = new Set<string>();

    return arr.filter((item) => {
        const lower = item.toLowerCase();

        if (seen.has(lower)) {
            return false;
        }

        seen.add(lower);
        return true;
    });
}