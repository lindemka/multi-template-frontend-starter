import React from 'react';
import MultipurposeLayout from '@/components/layouts/MultipurposeLayout';

export default function MultipurposePage() {
  return (
    <MultipurposeLayout>
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Multipurpose Template
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Simple multipurpose page using multipurpose template assets with modern React components
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Get started
              </button>
              <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-32">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-md bg-blue-500 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Fast Performance</h3>
                <p className="mt-2 text-gray-600">
                  Built with Next.js and optimized for speed and performance.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-md bg-green-500 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Reliable</h3>
                <p className="mt-2 text-gray-600">
                  Enterprise-grade Spring Boot backend with robust API design.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-md bg-purple-500 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Modern Design</h3>
                <p className="mt-2 text-gray-600">
                  Beautiful, responsive design built with Tailwind CSS.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of users building amazing applications.
            </p>
            <div className="mt-8">
              <button className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500">
                Start building today
              </button>
            </div>
          </div>
        </div>
      </div>
    </MultipurposeLayout>
  );
}