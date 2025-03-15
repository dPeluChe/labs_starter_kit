import React from 'react';
import { Metadata } from 'next';
import { TrendingUp, Users, MessageSquare, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics - Feedby',
  description: 'View your feedback analytics',
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Total Feedback</h2>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <p className="text-4xl font-bold mt-2">1,234</p>
            <p className="text-base-content/70 text-sm mt-2">
              <span className="text-success">↑ 12%</span> from last month
            </p>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Active Users</h2>
              <Users className="h-8 w-8 text-secondary" />
            </div>
            <p className="text-4xl font-bold mt-2">5,678</p>
            <p className="text-base-content/70 text-sm mt-2">
              <span className="text-success">↑ 8%</span> from last month
            </p>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Response Rate</h2>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
            <p className="text-4xl font-bold mt-2">92%</p>
            <p className="text-base-content/70 text-sm mt-2">
              <span className="text-error">↓ 3%</span> from last month
            </p>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title">Avg. Response Time</h2>
              <Clock className="h-8 w-8 text-info" />
            </div>
            <p className="text-4xl font-bold mt-2">4.2h</p>
            <p className="text-base-content/70 text-sm mt-2">
              <span className="text-success">↑ 15%</span> faster than last month
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Feedback Trends</h2>
            <div className="h-64 w-full bg-base-200 rounded-lg flex items-center justify-center">
              <p className="text-base-content/50">Chart Placeholder: Feedback over time</p>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button className="btn btn-sm">Last Week</button>
              <button className="btn btn-sm btn-primary">Last Month</button>
              <button className="btn btn-sm">Last Year</button>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Feedback Categories</h2>
            <div className="h-64 w-full bg-base-200 rounded-lg flex items-center justify-center">
              <p className="text-base-content/50">Chart Placeholder: Feedback by category</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                <span className="text-sm">Bug Reports</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
                <span className="text-sm">Feature Requests</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
                <span className="text-sm">Support</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-info mr-2"></div>
                <span className="text-sm">Other</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">User Engagement</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Feedback Submitted</th>
                  <th>Last Active</th>
                  <th>Engagement Score</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>32</td>
                  <td>Today</td>
                  <td>
                    <progress className="progress progress-success w-full" value="85" max="100"></progress>
                  </td>
                  <td><span className="text-success">↑</span></td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>28</td>
                  <td>Yesterday</td>
                  <td>
                    <progress className="progress progress-success w-full" value="78" max="100"></progress>
                  </td>
                  <td><span className="text-success">↑</span></td>
                </tr>
                <tr>
                  <td>Bob Johnson</td>
                  <td>15</td>
                  <td>3 days ago</td>
                  <td>
                    <progress className="progress progress-warning w-full" value="45" max="100"></progress>
                  </td>
                  <td><span className="text-error">↓</span></td>
                </tr>
                <tr>
                  <td>Alice Brown</td>
                  <td>22</td>
                  <td>Today</td>
                  <td>
                    <progress className="progress progress-info w-full" value="65" max="100"></progress>
                  </td>
                  <td><span className="text-success">↑</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card-actions justify-end mt-4">
            <button className="btn btn-primary btn-sm">View All Users</button>
          </div>
        </div>
      </div>
    </div>
  );
}