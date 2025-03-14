"use client";

import React from 'react';
import Navbar from './Navbar';
import Link from 'next/link';

export default function Hero() {
  // Función para manejar el desplazamiento suave
  const scrollToFeatures = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const features = document.getElementById('features');
    if (features) {
      window.scrollTo({
        top: features.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-base-200">
      <div className="z-10">
        <Navbar />
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row-reverse items-center gap-8">
          <div className="w-full lg:w-1/2">
            <div className="w-full h-64 lg:h-96 bg-base-300 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-base-content/60">Hero Image</span>
            </div>
          </div>
          <div className="w-full lg:w-1/2 max-w-md">
            <h1 className="text-5xl font-bold text-base-content">Welcome to Feedby</h1>
            <p className="py-6 text-base-content/80">
              The ultimate platform for managing your feedback and improving your products.
              Get started today and see the difference.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="btn btn-primary">Get Started</Link>
              <a href="#features" className="btn btn-outline" onClick={scrollToFeatures}>Learn More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}