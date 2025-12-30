'use client';

import { useState } from 'react';

export default function HomePage() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: {
        content: string;
        ttl_seconds?: number;
        max_views?: number;
      } = {
        content,
      };

      if (ttlSeconds) {
        const parsed = parseInt(ttlSeconds, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          body.ttl_seconds = parsed;
        }
      }

      if (maxViews) {
        const parsed = parseInt(maxViews, 10);
        if (!isNaN(parsed) && parsed >= 1) {
          body.max_views = parsed;
        }
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create paste');
      } else {
        setResult(data);
        setContent('');
        setTtlSeconds('');
        setMaxViews('');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pastebin Lite</h1>
          <p className="text-gray-600">Share text snippets with optional expiry and view limits</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your text here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="ttl" className="block text-sm font-medium text-gray-700 mb-2">
                  Time to Live (seconds)
                </label>
                <input
                  type="number"
                  id="ttl"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Views
                </label>
                <input
                  type="number"
                  id="maxViews"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional"
                  min="1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Paste'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-green-800 font-medium mb-3">Paste created successfully!</p>
            <div className="bg-white rounded border border-green-300 p-3 mb-3">
              <p className="text-sm text-gray-600 mb-1">Paste ID:</p>
              <p className="font-mono font-semibold text-gray-900">{result.id}</p>
            </div>
            <div className="bg-white rounded border border-green-300 p-3">
              <p className="text-sm text-gray-600 mb-1">Shareable Link:</p>
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-600 hover:text-blue-800 break-all"
              >
                {result.url}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
