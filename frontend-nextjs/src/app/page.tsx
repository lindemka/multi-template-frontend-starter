import React from 'react';
import MultipurposeLayout from '@/components/layouts/MultipurposeLayout';
import Link from 'next/link';

export default function Home() {
  return (
    <MultipurposeLayout>
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Multi-Template Frontend Starter
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A powerful dual-template system built with Next.js and Spring Boot. 
              Perfect for building modern web applications with both dashboard and marketing page capabilities.
            </p>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link 
                href="/dashboard"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                View Dashboard
              </Link>
              <Link 
                href="/multipurpose" 
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
              >
                Explore Templates <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Template Showcase */}
          <div className="mt-32 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative">
              <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Template</h3>
                <p className="text-gray-600 mb-6">
                  Full-featured admin dashboard with user management, data tables, and responsive sidebar navigation.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    User Management System
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    React Query Integration
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Responsive Design
                  </div>
                </div>
                <Link 
                  href="/dashboard"
                  className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-500"
                >
                  View Dashboard →
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Multipurpose Template</h3>
                <p className="text-gray-600 mb-6">
                  Marketing-focused template perfect for landing pages, company websites, and public-facing content.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    SEO Optimized
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Mobile-First Design
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Marketing Components
                  </div>
                </div>
                <Link 
                  href="/multipurpose"
                  className="mt-6 inline-flex items-center text-blue-600 hover:text-blue-500"
                >
                  Explore Template →
                </Link>
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="mt-32">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Built with Modern Technology
            </h2>
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-md bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">Next.js 14</h3>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-md bg-green-600 flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">Spring Boot</h3>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-md bg-blue-400 flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">TypeScript</h3>
              </div>
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-md bg-cyan-500 flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-gray-900">TailwindCSS</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MultipurposeLayout>
  );
}
