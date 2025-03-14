import React from 'react';
import Hero from '@/components/landing/Hero';
import Gallery from '@/components/landing/Gallery';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <Gallery />
      <Footer />
    </main>
  );
}