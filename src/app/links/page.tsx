"use client";
import { useState, useEffect } from "react";
import { UrlForm } from "@/components/url/UrlForm";
import { getAllLinks, type LinkInfo } from "@/lib/api";
  
export default function LinksPage() {
  const [links, setLinks] = useState<LinkInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load links from API
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getAllLinks();
        setLinks(data.links);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch links:", err);
        setError("Failed to load links. Please try again.");
        // Fallback to localStorage if API fails
        const recentLinks = JSON.parse(localStorage.getItem("recent-links") || "[]");
        const fallbackLinks: LinkInfo[] = recentLinks.map((url: string, index: number) => ({
          code: `link-${index}`,
          short_url: url,
          long_url: `https://example.com/original-url-${index}`,
          clicks: Math.floor(Math.random() * 100),
          max_clicks: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : 0,
          requires_password: Math.random() > 0.7,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        setLinks(fallbackLinks);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const filteredLinks = links.filter(link =>
    link.short_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.long_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Links</h1>
          <p className="text-muted-foreground">Manage and track your shortened URLs</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {links.length} total links
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Quick Create Form */}
      <div className="card-elevated p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Link</h2>
        <UrlForm />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-secondary">All</button>
          <button className="btn btn-secondary">Password Protected</button>
          <button className="btn btn-secondary">Expired</button>
        </div>
      </div>

      {/* Links Table */}
      <div className="card">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Links</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="p-4 font-medium">Short URL</th>
                <th className="p-4 font-medium">Original URL</th>
                <th className="p-4 font-medium">Clicks</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Created</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No links found. Create your first short link above!
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr key={link.code} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <a
                          href={link.short_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono text-sm"
                        >
                          {link.short_url}
                        </a>
                        {link.requires_password && (
                          <span className="badge badge-primary">
                            🔒
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {link.long_url}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{link.clicks}</span>
                        {link.max_clicks > 0 && (
                          <span className="text-xs text-muted-foreground">
                            / {link.max_clicks}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${
                        link.max_clicks > 0 && link.clicks >= link.max_clicks
                          ? "badge-destructive"
                          : "badge-success"
                      }`}>
                        {link.max_clicks > 0 && link.clicks >= link.max_clicks ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(link.short_url)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Copy
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          Stats
                        </button>
                        <button className="text-xs text-destructive hover:text-destructive/80">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


