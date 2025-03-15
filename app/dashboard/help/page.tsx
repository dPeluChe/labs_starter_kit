import React from 'react';
import { Metadata } from 'next';
import { HelpCircle, Book, MessageSquare, FileText, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help - Feedby',
  description: 'Get help with using Feedby',
};

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Help Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center">
              <Book className="h-6 w-6 text-primary mr-3" />
              <h2 className="card-title">Documentation</h2>
            </div>
            <p className="mt-2">Comprehensive guides and documentation to help you use Feedby effectively.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary btn-sm">View Docs</button>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-secondary mr-3" />
              <h2 className="card-title">Support Chat</h2>
            </div>
            <p className="mt-2">Chat with our support team to get immediate assistance with any issues.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-secondary btn-sm">Start Chat</button>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-accent mr-3" />
              <h2 className="card-title">Tutorials</h2>
            </div>
            <p className="mt-2">Step-by-step tutorials to help you get the most out of Feedby.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-accent btn-sm">View Tutorials</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Frequently Asked Questions</h2>
          
          <div className="mt-4 space-y-4">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" checked /> 
              <div className="collapse-title text-xl font-medium">
                How do I create a new feedback form?
              </div>
              <div className="collapse-content"> 
                <p>To create a new feedback form, navigate to the Dashboard and click on the "New Feedback" button. Follow the on-screen instructions to customize your form with the questions and fields you need.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                How can I export my feedback data?
              </div>
              <div className="collapse-content"> 
                <p>You can export your feedback data by going to the Analytics page and clicking on the "Export" button. You can choose to export in CSV, Excel, or PDF format.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                Can I customize the appearance of my feedback forms?
              </div>
              <div className="collapse-content"> 
                <p>Yes, you can customize the appearance of your feedback forms by going to the Settings page and selecting the "Form Appearance" tab. From there, you can change colors, fonts, and add your logo.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                How do I add team members to my account?
              </div>
              <div className="collapse-content"> 
                <p>To add team members, go to the Users page and click on the "Add User" button. Enter their email address and select their role. They will receive an invitation to join your team.</p>
              </div>
            </div>
            
            <div className="collapse collapse-arrow bg-base-200">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                Is my feedback data secure?
              </div>
              <div className="collapse-content"> 
                <p>Yes, we take security very seriously. All data is encrypted in transit and at rest. We use industry-standard security practices to protect your data. For more information, please see our Security page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Contact Us</h2>
          <p className="mt-2">Can't find what you're looking for? Contact our support team directly.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input type="text" placeholder="Your name" className="input input-bordered w-full" />
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="Your email" className="input input-bordered w-full" />
            </div>
          </div>
          
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Subject</span>
            </label>
            <input type="text" placeholder="Subject" className="input input-bordered w-full" />
          </div>
          
          <div className="form-control w-full mt-4">
            <label className="label">
              <span className="label-text">Message</span>
            </label>
            <textarea className="textarea textarea-bordered h-32" placeholder="Your message"></textarea>
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Send Message</button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="flex items-center text-base-content/70">
          <ExternalLink className="h-4 w-4 mr-2" />
          <span>Need more help? Visit our <a href="#" className="link link-primary">Help Center</a> for more resources.</span>
        </div>
      </div>
    </div>
  );
}