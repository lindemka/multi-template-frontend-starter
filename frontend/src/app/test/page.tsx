'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Check, X } from 'lucide-react';

export default function HotReloadTest() {
  const t = useTranslations();
  const [counter, setCounter] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    // Check API status
    fetch('/api/members')
      .then(() => setApiStatus('online'))
      .catch(() => setApiStatus('offline'));
  }, []);

  const testFeatures = [
    { name: t('test.features.hotReload.name'), status: true, description: t('test.features.hotReload.description') },
    { name: t('test.features.statePersistence.name'), status: true, description: t('test.features.statePersistence.description') },
    { name: t('test.features.apiProxy.name'), status: apiStatus === 'online', description: t('test.features.apiProxy.description') },
    { name: t('test.features.fastRefresh.name'), status: true, description: t('test.features.fastRefresh.description') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              {t('test.title')}
            </CardTitle>
            <CardDescription>
              {t('test.fileLocation')} <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">src/app/test/page.tsx</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Test 1: Text Change */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">{t('test.testHotReload')}</h3>
              <p className="text-sm text-gray-600">
                🚀 HOT RELOAD TEST SUCCESSFUL! Change this text and watch it update instantly!
                Current time: {Date().toString()}
              </p>
            </div>

            {/* Test 2: State Persistence */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">{t('test.statePersistence')}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {t('test.statePersistenceDesc')}
              </p>
              <div className="flex items-center gap-4">
                <Button onClick={() => setCounter(c => c + 1)}>
                  {t('common.increment')}
                </Button>
                <span className="text-2xl font-bold">{counter}</span>
                <Button variant="outline" onClick={() => setCounter(0)}>
                  {t('common.reset')}
                </Button>
              </div>
            </div>

            {/* Test 3: Feature Status */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold mb-3">{t('test.featureStatus')}</h3>
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
                        {feature.status ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test 4: Last Update */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2">{t('test.lastHotReload')}</h3>
              <p className="text-sm text-gray-600">
                {t('test.pageLoadedAt')} {lastUpdate.toLocaleTimeString()}
              </p>
              <Button 
                className="mt-2" 
                variant="outline"
                onClick={() => setLastUpdate((() => new Date())())}
              >
                {t('test.updateTimestamp')}
              </Button>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">{t('test.howToTest')}</h3>
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