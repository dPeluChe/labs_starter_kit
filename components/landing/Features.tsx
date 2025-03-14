import React from 'react';

export default function Features() {
  return (
    <div id="features" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-base-content">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card bg-base-200 shadow-xl hover:shadow-2xl">
            <div className="card-body">
              <h3 className="card-title text-base-content">Fast Feedback</h3>
              <p className="text-base-content/80">Get instant feedback from your users and customers to improve your products.</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl hover:shadow-2xl">
            <div className="card-body">
              <h3 className="card-title text-base-content">Analytics</h3>
              <p className="text-base-content/80">Powerful analytics to understand user behavior and preferences.</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl hover:shadow-2xl">
            <div className="card-body">
              <h3 className="card-title text-base-content">Secure</h3>
              <p className="text-base-content/80">Enterprise-grade security to protect your data and your users' privacy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}