"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const [settings, setSettings] = useState({
    defaultTtl: 86400,
    defaultPassword: "",
    customDomain: "",
    theme: "system",
    notifications: true,
    analytics: true,
    autoCopy: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save settings to localStorage
      localStorage.setItem("settings", JSON.stringify(settings));
      // In production, also save to API
      // await saveSettings(settings);
      alert("Settings saved!");
    } catch (error) {
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to access settings.</p>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">Demo credentials:</p>
            <p className="font-mono text-sm">Email: demo@example.com</p>
            <p className="font-mono text-sm">Password: demo123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and configuration</p>
      </div>

      {/* General Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">General</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="default-ttl">
                Default Expiration
              </label>
              <select
                id="default-ttl"
                value={settings.defaultTtl}
                onChange={(e) => setSettings({ ...settings, defaultTtl: Number(e.target.value) })}
                className="input"
              >
                <option value="3600">1 hour</option>
                <option value="86400">1 day</option>
                <option value="604800">7 days</option>
                <option value="2592000">30 days</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="theme">
                Theme
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="default-password">
              Default Password (Optional)
            </label>
            <input
              id="default-password"
              type="password"
              value={settings.defaultPassword}
              onChange={(e) => setSettings({ ...settings, defaultPassword: e.target.value })}
              placeholder="Leave empty for no default"
              className="input"
            />
            <p className="text-xs text-muted-foreground">
              This password will be pre-filled when creating new links
            </p>
          </div>
        </div>
      </div>

      {/* Custom Domain */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Custom Domain</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="custom-domain">
              Custom Domain
            </label>
            <input
              id="custom-domain"
              type="text"
              value={settings.customDomain}
              onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
              placeholder="short.yourdomain.com"
              className="input"
            />
            <p className="text-xs text-muted-foreground">
              Set up a custom domain for your short links (requires DNS configuration)
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="text-sm font-medium mb-2">DNS Configuration</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Add these DNS records to your domain:
            </p>
            <div className="font-mono text-xs bg-background p-2 rounded border">
              <div>A short.yourdomain.com → 192.168.0.125</div>
              <div>CNAME *.short.yourdomain.com → short.yourdomain.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Email Notifications</h4>
              <p className="text-xs text-muted-foreground">Get notified when links reach click limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Analytics</h4>
              <p className="text-xs text-muted-foreground">Track clicks and generate reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.analytics}
                onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Auto-copy Links</h4>
              <p className="text-xs text-muted-foreground">Automatically copy new short links to clipboard</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoCopy}
                onChange={(e) => setSettings({ ...settings, autoCopy: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* API Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">API Access</h2>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="text-sm font-medium mb-2">API Key</h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value="sk-1234567890abcdef"
                readOnly
                className="input flex-1 font-mono text-sm"
              />
              <button className="btn btn-secondary">Regenerate</button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Use this key to access the API programmatically
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="text-sm font-medium mb-2">API Documentation</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Learn how to integrate with our API
            </p>
            <button className="btn btn-secondary">View Docs</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-destructive/20">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Delete All Links</h4>
              <p className="text-xs text-muted-foreground">Permanently delete all your shortened links</p>
            </div>
            <button className="btn bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Export Data</h4>
              <p className="text-xs text-muted-foreground">Download all your links and analytics data</p>
            </div>
            <button className="btn btn-secondary">Export</button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}


