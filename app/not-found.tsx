import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found - Feedby',
  description: 'The page you are looking for does not exist',
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center max-w-md p-6">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="divider"></div>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="mb-6 text-base-content/70">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-primary">
            Go to Homepage
          </Link>
          <Link href="/dashboard" className="btn btn-outline">
            Go to Dashboard
          </Link>
        </div>
        
        <div className="mt-12">
          <div className="text-sm text-base-content/50">
            Lost? Try one of these pages:
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Link href="/" className="badge badge-outline p-3">Home</Link>
            <Link href="/dashboard" className="badge badge-outline p-3">Dashboard</Link>
            <Link href="/login" className="badge badge-outline p-3">Login</Link>
            <Link href="/dashboard/settings" className="badge badge-outline p-3">Settings</Link>
            <Link href="/dashboard/help" className="badge badge-outline p-3">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
}