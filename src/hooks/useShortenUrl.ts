"use client";
import { useCallback, useState } from "react";
import { getPreview, getStats, shortenUrl, type PreviewResponse, type StatsResponse } from "@/lib/api";
import { getRecentLinks, saveRecentLink } from "@/lib/utils";
import { isValidHttpUrl } from "@/lib/validators";

export function useShortenUrl() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [alias, setAlias] = useState<string>("");
  const [ttl, setTtl] = useState<number>(86400);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [password, setPassword] = useState<string>("");
  const [maxClicks, setMaxClicks] = useState<number>(0);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    setError(null);
    setResult(null);
    setStats(null);
    if (!isValidHttpUrl(input)) {
      setError("Enter a valid http(s) URL");
      return;
    }
    setLoading(true);
    try {
      const data = await shortenUrl({ url: input, alias: alias || undefined, ttl: ttl || undefined, password: password || undefined, maxClicks: maxClicks || undefined });
      setResult(data.short_url);
      saveRecentLink(data.short_url);
      setRecent(getRecentLinks());
      try {
        const code = data.short_url.split("/").pop() || "";
        const s = await getStats(code);
        setStats(s);
        const p = await getPreview(code);
        setPreview(p);
      } catch {}
    } catch (e: any) {
      setError(e?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  }, [input, alias, ttl]);

  return {
    input,
    setInput,
    result,
    loading,
    error,
    submit,
    alias,
    setAlias,
    ttl,
    setTtl,
    stats,
    recent,
    password,
    setPassword,
    maxClicks,
    setMaxClicks,
    preview,
  };
}


