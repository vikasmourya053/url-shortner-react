export type ShortenResponse = { short_url: string };
export type StatsResponse = { code: string; clicks: number };
export type PreviewResponse = { code: string; url: string; clicks: number; maxClicks: number; requiresPassword: boolean };
export type LinkInfo = {
  code: string;
  short_url: string;
  long_url: string;
  clicks: number;
  max_clicks: number;
  requires_password: boolean;
  created_at: string;
  expires_at?: string;
};
export type LinksResponse = { links: LinkInfo[]; total: number };
export type AnalyticsResponse = {
  total_links: number;
  total_clicks: number;
  password_protected: number;
  expired_links: number;
  clicks_today: number;
  clicks_this_week: number;
};

export async function shortenUrl(payload: { url: string; alias?: string; ttl?: number; password?: string; maxClicks?: number }): Promise<ShortenResponse> {
  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to shorten URL");
  }
  return res.json();
}

export async function getStats(code: string): Promise<StatsResponse> {
  const res = await fetch(`/api/stats?code=${encodeURIComponent(code)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch stats");
  }
  return res.json();
}

export async function getPreview(code: string): Promise<PreviewResponse> {
  const res = await fetch(`/api/preview?code=${encodeURIComponent(code)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch preview");
  }
  return res.json();
}

export async function getAllLinks(): Promise<LinksResponse> {
  const res = await fetch("/api/links");
  if (!res.ok) {
    throw new Error("Failed to fetch links");
  }
  return res.json();
}

export async function getAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch("/api/analytics");
  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return res.json();
}


