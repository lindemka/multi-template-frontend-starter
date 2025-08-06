'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Check, X } from 'lucide-react';

export default function HotReloadTest() {
  const [counter, setCounter] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Check API status
    fetch('/api/users')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const testFeatures = [
    { name: 'Hot Reload', status: true, description: 'Change this text and save!' },
    { name: 'State Persistence', status: true, description: 'Counter maintains value' },
    { name: 'API Proxy', status: apiStatus === 'online', description: 'Backend connection' },
    { name: 'Fast Refresh', status: true, description: 'No full page reload' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Hot Reload Test Page
            </CardTitle>
            <CardDescription>
              Edit this file at: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">src/app/test/page.tsx</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test 1: Text Change */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">🔥 Test Hot Reload</h3>
              <p className="text-sm text-gray-600">
                Change this text in the code and watch it update instantly!
                Current time: {new Date().toLocaleTimeString()}
              </p>
            </div>

            {/* Test 2: State Persistence */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">💾 State Persistence Test</h3>
              <p className="text-sm text-gray-600 mb-3">
                Counter should maintain value during hot reload:
              </p>
              <div className="flex items-center gap-4">
                <Button onClick={() => setCounter(c => c + 1)}>
                  Increment
                </Button>
                <span className="text-2xl font-bold">{counter}</span>
                <Button variant="outline" onClick={() => setCounter(0)}>
                  Reset
                </Button>
              </div>
            </div>

            {/* Test 3: Feature Status */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold mb-3">✅ Feature Status</h3>
              <div className="space-y-2">
                {testFeatures.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feature.status ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium">{feature.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{feature.description}</span>
                      <Badge variant={feature.status ? 'default' : 'secondary'}>
                        {feature.status ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test 4: Last Update */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2">🕐 Last Hot Reload</h3>
              <p className="text-sm text-gray-600">
                Page loaded at: {lastUpdate.toLocaleTimeString()}
              </p>
              <Button 
                className="mt-2" 
                variant="outline"
                onClick={() => setLastUpdate(new Date())}
              >
                Update Timestamp
              </Button>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">📝 How to Test</h3>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Click &quot;Increment&quot; to increase the counter</li>
                <li>Edit any text in this file and save</li>
                <li>Watch the page update without losing counter state</li>
                <li>No browser refresh needed!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}