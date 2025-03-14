import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Feedby - Collect and Manage Feedback',
  description: 'The ultimate platform for collecting, managing, and acting on customer feedback.',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}