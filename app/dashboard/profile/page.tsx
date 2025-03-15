import React from 'react';
import { Metadata } from 'next';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profile - Feedby',
  description: 'Manage your profile',
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl lg:col-span-1">
          <div className="card-body items-center text-center">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="User avatar" />
              </div>
            </div>
            <h2 className="card-title mt-4">John Doe</h2>
            <p className="text-base-content/70">Administrator</p>
            
            <div className="divider"></div>
            
            <div className="w-full">
              <div className="flex items-center mb-3">
                <Mail className="h-5 w-5 mr-2" />
                <span>john.doe@example.com</span>
              </div>
              <div className="flex items-center mb-3">
                <Phone className="h-5 w-5 mr-2" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center mb-3">
                <MapPin className="h-5 w-5 mr-2" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Joined: Jan 2023</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>Role: Administrator</span>
              </div>
            </div>
            
            <div className="card-actions mt-6">
              <button className="btn btn-primary btn-sm">Edit Profile</button>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Profile Information</h2>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" placeholder="John Doe" className="input input-bordered w-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="john.doe@example.com" className="input input-bordered w-full" />
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input type="tel" placeholder="+1 (555) 123-4567" className="input input-bordered w-full" />
              </div>
            </div>
            
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input type="text" placeholder="San Francisco, CA" className="input input-bordered w-full" />
            </div>
            
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea className="textarea textarea-bordered h-24" placeholder="Tell us about yourself"></textarea>
            </div>
            
            <div className="divider"></div>
            
            <h2 className="card-title">Change Password</h2>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
              </div>
            </div>
            
            <div className="card-actions justify-end mt-6">
              <button className="btn">Cancel</button>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}