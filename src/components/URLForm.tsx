import React, { useState } from 'react';
import { Link2, Settings } from 'lucide-react';

interface URLFormProps {
  onSubmit: (url: string, selector: string, headers: Record<string, string>) => void;
  isLoading: boolean;
}

export function URLForm({ onSubmit, isLoading }: URLFormProps) {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userAgent, setUserAgent] = useState('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  const [cookie, setCookie] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const headers: Record<string, string> = {
      'User-Agent': userAgent,
    };
    if (cookie) {
      headers['Cookie'] = cookie;
    }
    onSubmit(url, selector, headers);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div className="space-y-2">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="selector" className="block text-sm font-medium text-gray-700">
          CSS Selector
        </label>
        <input
          type="text"
          id="selector"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder=".article-content, #main-content"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Settings className="h-4 w-4 mr-2" />
          Advanced Options
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-md">
          <div className="space-y-2">
            <label htmlFor="userAgent" className="block text-sm font-medium text-gray-700">
              User Agent
            </label>
            <input
              type="text"
              id="userAgent"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cookie" className="block text-sm font-medium text-gray-700 flex items-center justify-between">
              <span>Website Cookies</span>
              <span className="text-xs text-indigo-600">(Required for login-protected content)</span>
            </label>
            <div className="bg-white p-4 rounded-md border border-gray-200 space-y-4">
              <h3 className="text-sm font-medium text-gray-900">How to get your cookies:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Right-click anywhere on the webpage you want to capture</li>
                <li>Select "Inspect" or press F12 to open Developer Tools</li>
                <li>Click the "Network" tab at the top</li>
                <li>Refresh the webpage</li>
                <li>Click the first item in the Network list (usually the webpage URL)</li>
                <li>Scroll down to find "Cookie:" under "Request Headers"</li>
                <li>Copy everything after "Cookie: " and paste it below</li>
              </ol>
              <div className="mt-4">
                <textarea
                  id="cookie"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Paste your cookies here..."
                  rows={3}
                />
              </div>
              <p className="text-xs text-gray-500 italic">
                💡 Tip: If you're trying to capture content that requires you to be logged in, 
                make sure you're logged into the website first, then follow these steps.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Generate Image'}
      </button>
    </form>
  );
}