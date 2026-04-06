import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ articles: [], error: "GROQ_API_KEY not configured" }, { status: 500 });
    }
    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      model: "compound-beta-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a news aggregator. Search the web for the latest news about the Middle East and Dubai. Return ONLY a valid JSON array — no markdown, no code fences. Each item: id (string), title (string), summary (2 sentences max), source (string), url (string or empty), fetchedAt (ISO timestamp).",
        },
        {
          role: "user",
          content: "Find 6 top news stories today about the Middle East and Dubai. JSON array only.",
        },
      ],
      max_tokens: 1200,
    });

    const raw = completion.choices[0]?.message?.content ?? "[]";

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/```(?:json)?/g, "").trim();
    const articles = JSON.parse(cleaned);

    return NextResponse.json({ articles });
  } catch (err) {
    console.error("News fetch error:", err);
    return NextResponse.json({ articles: [], error: "Failed to fetch news" }, { status: 500 });
  }
}
