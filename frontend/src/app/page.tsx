'use client';

import Link from 'next/link';

// Force static generation for this page
export const dynamic = 'force-static';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ExternalLink, Home, Users, TestTube } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function LandingPage() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          {/* Logo/Title */}
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t('home.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12">
            {t('home.subtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Internal Link - Dashboard */}
            <Button asChild size="lg" className="group">
              <Link href="/dashboard">
                {t('navigation.dashboard')}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            {/* External Link */}
            <Button asChild size="lg" variant="outline">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                {t('home.learnMore')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link href="/" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>{t('navigation.home')}</CardTitle>
                <CardDescription>
                  {t('home.cards.home.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {t('home.cards.home.content')}
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-blue-600 hover:underline">
                  {t('home.youAreHere')}
                </span>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/dashboard" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>{t('dashboard.title')}</CardTitle>
                <CardDescription>
                  {t('home.cards.dashboard.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {t('home.cards.dashboard.content')}
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-green-600 hover:underline">
                  {t('navigation.dashboard')} →
                </span>
              </CardFooter>
            </Card>
          </Link>

          <Link href="/test" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TestTube className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>{t('navigation.test')}</CardTitle>
                <CardDescription>
                  {t('home.cards.test.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {t('home.cards.test.content')}
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-sm text-purple-600 hover:underline">
                  {t('home.testFeatures')}
                </span>
              </CardFooter>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          {t('home.footer')}
        </p>
      </div>
    </div>
  );
}