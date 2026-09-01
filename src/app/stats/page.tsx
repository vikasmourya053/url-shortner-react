"use client";
import { useState, useEffect } from "react";
import { getAnalytics, getAllLinks, type AnalyticsResponse, type LinkInfo } from "@/lib/api";

export default function StatsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [topLinks, setTopLinks] = useState<LinkInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsData, linksData] = await Promise.all([
          getAnalytics(),
          getAllLinks()
        ]);
        
        setAnalytics(analyticsData);
        // Sort links by clicks and take top 3
        const sortedLinks = linksData.links.sort((a, b) => b.clicks - a.clicks).slice(0, 3);
        setTopLinks(sortedLinks);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics. Please try again.");
        // Fallback to mock data
        setAnalytics({
          total_links: 24,
          total_clicks: 1247,
          password_protected: 8,
          expired_links: 3,
          clicks_today: 45,
          clicks_this_week: 312,
        });
        setTopLinks([
          { code: "abc123", short_url: "http://localhost:8080/abc123", long_url: "https://example.com/very-long-url", clicks: 156, max_clicks: 0, requires_password: false, created_at: "2024-01-15T10:30:00Z" },
          { code: "def456", short_url: "http://localhost:8080/def456", long_url: "https://github.com/user/repo", clicks: 89, max_clicks: 100, requires_password: true, created_at: "2024-01-14T15:45:00Z" },
          { code: "ghi789", short_url: "http://localhost:8080/ghi789", long_url: "https://docs.example.com/guide", clicks: 67, max_clicks: 50, requires_password: false, created_at: "2024-01-13T09:20:00Z" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock clicks over time data (in production, this would come from the API)
  const clicksOverTime = [
    { date: "2024-01-08", clicks: 23 },
    { date: "2024-01-09", clicks: 45 },
    { date: "2024-01-10", clicks: 67 },
    { date: "2024-01-11", clicks: 34 },
    { date: "2024-01-12", clicks: 89 },
    { date: "2024-01-13", clicks: 56 },
    { date: "2024-01-14", clicks: 78 },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your link performance and insights</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("24h")}
            className={`btn ${timeRange === "24h" ? "btn-primary" : "btn-secondary"}`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeRange("7d")}
            className={`btn ${timeRange === "7d" ? "btn-primary" : "btn-secondary"}`}
          >
            7d
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`btn ${timeRange === "30d" ? "btn-primary" : "btn-secondary"}`}
          >
            30d
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Links</p>
              <p className="text-2xl font-bold text-foreground">{analytics.total_links}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14L21 3m-7 4h6v6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold text-foreground">{analytics.total_clicks.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Clicks Today</p>
              <p className="text-2xl font-bold text-foreground">{analytics.clicks_today}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Password Protected</p>
              <p className="text-2xl font-bold text-foreground">{analytics.password_protected}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Link Status */}
      <div className="grid grid-cols-1 gap-6">
        <div className="card-elevated p-6">
          <h3 className="text-lg font-semibold mb-4">Link Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Links</span>
              <span className="font-medium">{analytics.total_links - analytics.expired_links}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Expired Links</span>
              <span className="font-medium text-destructive">{analytics.expired_links}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Password Protected</span>
              <span className="font-medium">{analytics.password_protected}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${((analytics.total_links - analytics.expired_links) / analytics.total_links) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Links */}
      <div className="card-elevated">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Top Performing Links</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {topLinks.map((link, index) => (
              <div key={link.code} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <a
                      href={link.short_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-mono text-sm"
                    >
                      {link.short_url}
                    </a>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">
                      {link.long_url}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{link.clicks} clicks</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(link.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


