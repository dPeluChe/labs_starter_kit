import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function EnvErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <AlertTriangle className="h-16 w-16 text-error" />
          <h2 className="card-title text-2xl mt-4">Environment Variables Missing</h2>
          <p className="py-4">
            Required environment variables are missing or invalid. Please check your .env.local file.
          </p>
          <div className="card-actions">
            <Link href="/dashboard" className="btn btn-primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}