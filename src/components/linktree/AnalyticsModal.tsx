"use client";
import { useState, useEffect } from 'react';
import { getLinktreeAnalytics } from '@/lib/linktree-api';
import type { LinktreeAnalytics } from '@/lib/linktree-types';

interface AnalyticsModalProps {
  profileId: string;
  onClose: () => void;
}

export function AnalyticsModal({ profileId, onClose }: AnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<LinktreeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [profileId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getLinktreeAnalytics(profileId, timeRange);
      if (response.success && response.data) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">No Analytics Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Analytics data will appear here once you start getting views and clicks.
            </p>
            <button onClick={onClose} className="btn btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h2>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="input w-32"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {formatNumber(analytics.totalViews)}
            </div>
            <div className="text-sm text-muted-foreground">Total Views</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {formatNumber(analytics.totalClicks)}
            </div>
            <div className="text-sm text-muted-foreground">Total Clicks</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-info mb-1">
              {formatNumber(analytics.uniqueVisitors)}
            </div>
            <div className="text-sm text-muted-foreground">Unique Visitors</div>
          </div>
          <div className="card-elevated p-4 text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {analytics.totalViews > 0 ? ((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Click Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Links */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing Links</h3>
            <div className="space-y-3">
              {analytics.topLinks.map((link, index) => (
                <div key={link.linkId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{link.title}</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-success">
                    {link.clicks} clicks
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {analytics.referrers.map((referrer, index) => (
                <div key={referrer.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm">{referrer.source}</span>
                  </div>
                  <div className="text-sm font-medium">{referrer.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Types */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold mb-4">Device Types</h3>
            <div className="space-y-3">
              {analytics.devices.map((device, index) => (
                <div key={device.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-info"></div>
                    <span className="text-sm">{device.type}</span>
                  </div>
                  <div className="text-sm font-medium">{device.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Views Over Time */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
            <div className="space-y-2">
              {analytics.viewsByDay.slice(-7).map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ 
                          width: `${(day.views / Math.max(...analytics.viewsByDay.map(d => d.views))) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium w-12 text-right">{day.views}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
