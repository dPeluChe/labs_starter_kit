import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Feedby',
  description: 'Login or sign up to Feedby',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200">
      {children}
    </div>
  );
}