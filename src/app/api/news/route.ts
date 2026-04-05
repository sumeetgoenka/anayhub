import { NextResponse } from "next/server";

// Mock news data for now — will be replaced with Groq AI summaries later
function getMockNews() {
  const now = new Date().toISOString();
  return [
    {
      id: "1",
      title: "Iran Nuclear Talks: Latest Round of Negotiations Conclude in Vienna",
      summary: "Diplomats from Iran and Western nations concluded another round of nuclear negotiations. Key sticking points remain around uranium enrichment levels and sanctions relief timelines. Regional analysts say the outcome could significantly impact Gulf security.",
      source: "Reuters",
      url: "",
      fetchedAt: now,
    },
    {
      id: "2",
      title: "Dubai Announces Record Tourism Numbers for Q1 2026",
      summary: "Dubai welcomed over 5.2 million international visitors in Q1 2026, setting a new record. The emirate's tourism authority attributes growth to expanded airline routes and major events including the Dubai Shopping Festival.",
      source: "Gulf News",
      url: "",
      fetchedAt: now,
    },
    {
      id: "3",
      title: "UAE-Iran Maritime Trade Routes See Increased Activity",
      summary: "Commercial shipping between UAE ports and Iranian harbors has increased 18% year-over-year, according to new port authority data. Trade analysts point to shifting regional dynamics and new bilateral agreements.",
      source: "The National",
      url: "",
      fetchedAt: now,
    },
    {
      id: "4",
      title: "Middle East Tech Investment Hits $4.2B in 2026",
      summary: "Venture capital and private equity investment into Middle East tech startups reached $4.2 billion in the first quarter of 2026. UAE and Saudi Arabia lead the region with AI and fintech sectors driving the majority of deals.",
      source: "Arabian Business",
      url: "",
      fetchedAt: now,
    },
    {
      id: "5",
      title: "Iran Strait of Hormuz Exercises Draw International Attention",
      summary: "Iran's navy conducted scheduled exercises near the Strait of Hormuz, prompting responses from Gulf Cooperation Council nations. Approximately 20% of global oil passes through the strait daily.",
      source: "Al Jazeera",
      url: "",
      fetchedAt: now,
    },
    {
      id: "6",
      title: "Dubai Schools Report Record IGCSE and IB Results",
      summary: "Schools across Dubai reported their best-ever international exam results, with average scores rising 8% compared to last year. Education authorities credit increased investment in STEM programs and teacher training.",
      source: "Khaleej Times",
      url: "",
      fetchedAt: now,
    },
  ];
}

export async function GET() {
  // TODO: Replace with real news API / Groq AI summaries
  const articles = getMockNews();
  return NextResponse.json({ articles });
}
