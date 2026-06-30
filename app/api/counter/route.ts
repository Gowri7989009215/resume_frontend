import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const DATA_FILE = path.join(process.cwd(), "data", "counter.json");
const INITIAL_COUNT = 500;

function readCount(): number {
    try {
        if (!fs.existsSync(DATA_FILE)) return INITIAL_COUNT;
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const obj = JSON.parse(raw);
        return typeof obj.count === "number" ? obj.count : INITIAL_COUNT;
    } catch {
        return INITIAL_COUNT;
    }
}

function writeCount(count: number) {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify({ count }), "utf-8");
}

// GET /api/counter — returns current count
export async function GET() {
    return NextResponse.json({ count: readCount() });
}

// POST /api/counter — increments and returns new count
export async function POST() {
    const next = readCount() + 1;
    writeCount(next);
    return NextResponse.json({ count: next });
}
