import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings - Feedby',
  description: 'Configure your application settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">General Settings</h2>
          
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text">Application Name</span>
            </label>
            <input type="text" placeholder="Feedby" className="input input-bordered w-full" />
          </div>
          
          <div className="form-control w-full max-w-md mt-4">
            <label className="label">
              <span className="label-text">Default Language</span>
            </label>
            <select className="select select-bordered w-full">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          
          <div className="form-control mt-4">
            <label className="label cursor-pointer max-w-md">
              <span className="label-text">Enable Notifications</span> 
              <input type="checkbox" className="toggle toggle-primary" defaultChecked />
            </label>
          </div>
          
          <div className="form-control mt-4">
            <label className="label cursor-pointer max-w-md">
              <span className="label-text">Dark Mode by Default</span> 
              <input type="checkbox" className="toggle toggle-primary" />
            </label>
          </div>
          
          <div className="divider"></div>
          
          <h2 className="card-title">Email Settings</h2>
          
          <div className="form-control w-full max-w-md">
            <label className="label">
              <span className="label-text">SMTP Server</span>
            </label>
            <input type="text" placeholder="smtp.example.com" className="input input-bordered w-full" />
          </div>
          
          <div className="form-control w-full max-w-md mt-4">
            <label className="label">
              <span className="label-text">SMTP Port</span>
            </label>
            <input type="number" placeholder="587" className="input input-bordered w-full" />
          </div>
          
          <div className="form-control w-full max-w-md mt-4">
            <label className="label">
              <span className="label-text">Email From</span>
            </label>
            <input type="email" placeholder="noreply@example.com" className="input input-bordered w-full" />
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button className="btn">Cancel</button>
            <button className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}