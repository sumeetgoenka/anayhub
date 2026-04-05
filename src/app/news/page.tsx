"use client";

import { useState, useEffect } from "react";
import { Newspaper, RefreshCw, ExternalLink, Clock } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  fetchedAt: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchNews() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
      }
    } catch {
      setError("Failed to fetch news. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Daily News</h1>
          <p className="text-[var(--text-secondary)] mt-1">Middle East & Dubai updates — auto-fetched at 5 AM</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={fetchNews}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && (
        <div className="card mb-4 border-[var(--danger)] text-[var(--danger)]">
          {error}
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div className="card text-center py-12">
          <RefreshCw size={48} className="mx-auto mb-4 text-[var(--text-secondary)] animate-spin" />
          <p className="text-[var(--text-secondary)]">Fetching latest news...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="card text-center py-12">
          <Newspaper size={48} className="mx-auto mb-4 text-[var(--text-secondary)]" />
          <p className="text-[var(--text-secondary)]">No news articles available. Click Refresh to try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <div key={article.id} className="card flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold leading-snug">{article.title}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">{article.summary}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-[var(--accent)]">{article.source}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {new Date(article.fetchedAt).toLocaleTimeString()}
                  </span>
                </div>
                {article.url && (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[var(--accent)] hover:underline">
                    Read <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
