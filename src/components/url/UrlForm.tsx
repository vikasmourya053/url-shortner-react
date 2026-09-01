"use client";
import { useShortenUrl } from "@/hooks/useShortenUrl";
import { useCallback, useState } from "react";
import { Toast } from "@/components/ui/Toast";

export function UrlForm() {
  const { input, setInput, submit, loading, error, result, alias, setAlias, ttl, setTtl, stats, recent, password, setPassword, maxClicks, setMaxClicks, preview } = useShortenUrl();

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await submit();
    },
    [submit]
  );

  async function copyToClipboard() {
    if (result) await navigator.clipboard.writeText(result);
  }

  const qrSrc = result ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(result)}` : null;
  const copied = typeof window !== "undefined" ? (window as any).__copied__ : false;
  async function copyWithToast() {
    await copyToClipboard();
    if (typeof window !== "undefined") {
      (window as any).__copied__ = true;
      setTimeout(() => {
        (window as any).__copied__ = false;
      }, 1500);
    }
  }

  const [copiedOpen, setCopiedOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="long-url">
            Long URL
          </label>
          <input
            id="long-url"
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/very/long/url"
            className="input"
            required
            aria-describedby="long-url-hint"
            pattern="https?://.*"
          />
          <p id="long-url-hint" className="text-xs text-muted-foreground">
            Must start with http or https
          </p>
        </div>

        {/* Alias and TTL Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="alias">
              Custom Alias
            </label>
            <input
              id="alias"
              type="text"
              placeholder="my-custom-link"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className="input"
            />
            <p className="text-xs text-muted-foreground">Optional custom short code</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="ttl">
              Expiration
            </label>
            <select
              id="ttl"
              value={String(ttl)}
              onChange={(e) => setTtl(Number(e.target.value))}
              className="input"
            >
              <option value="3600">1 hour</option>
              <option value="86400">1 day</option>
              <option value="604800">7 days</option>
              <option value="2592000">30 days</option>
            </select>
          </div>
        </div>

        {/* Security Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            <p className="text-xs text-muted-foreground">Optional password protection</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="max-clicks">
              Max Clicks
            </label>
            <input
              id="max-clicks"
              type="number"
              min={0}
              placeholder="0"
              value={maxClicks || 0}
              onChange={(e) => setMaxClicks(Number(e.target.value))}
              className="input"
            />
            <p className="text-xs text-muted-foreground">0 = unlimited</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Shortening...
            </div>
          ) : (
            "Create Short Link"
          )}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm" role="alert">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Result Card */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Your Short Link</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {stats?.clicks || 0} clicks
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <a 
                href={result} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex-1 truncate text-primary hover:underline font-mono text-sm"
              >
                {result}
              </a>
              <button 
                onClick={() => { copyWithToast(); setCopiedOpen(true); }} 
                className="btn btn-secondary px-4 py-2 h-auto text-xs"
              >
                Copy
              </button>
            </div>

            {/* Link Info */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {preview?.requiresPassword && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Password protected
                </span>
              )}
              {preview?.maxClicks > 0 ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Max {preview.maxClicks} clicks
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Unlimited clicks
                </span>
              )}
            </div>

                {preview?.requiresPassword && (
                  <div className="pt-2">
                    <a
                      href={`/password/${preview.code}`}
                      className="btn btn-secondary h-9 px-4 text-xs"
                    >
                      Open (enter password)
                    </a>
                  </div>
                )}
          </div>

          {/* QR Code */}
          {qrSrc && (
            <div className="card p-6 text-center">
              <h4 className="text-sm font-medium text-foreground mb-3">QR Code</h4>
              <div className="flex justify-center">
                <img 
                  src={qrSrc} 
                  alt="QR code for short link" 
                  className="w-32 h-32 rounded-lg border"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Scan to open the link</p>
            </div>
          )}

          {/* Recent Links */}
          {recent.length > 0 && (
            <div className="card p-6">
              <h4 className="text-sm font-medium text-foreground mb-3">Recent Links</h4>
              <div className="space-y-2">
                {recent.map((link) => (
                  <div key={link} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-primary hover:underline truncate flex-1 mr-2"
                    >
                      {link}
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        setCopiedOpen(true);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Toast open={copiedOpen} onOpenChange={setCopiedOpen} message="Copied to clipboard" />
    </div>
  );
}


