import React from 'react';
import { Metadata } from 'next';
import { FileImage, Upload, Trash2, Download } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Assets - Feedby',
  description: 'Manage your media assets',
};

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Assets</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title">Media Library</h2>
            <button className="btn btn-primary">
              <Upload className="h-5 w-5 mr-2" />
              Upload New
            </button>
          </div>
          
          <div className="border-2 border-dashed border-base-300 rounded-lg p-8 mt-4 text-center">
            <FileImage className="h-12 w-12 mx-auto text-base-content/50" />
            <p className="mt-2 text-base-content/70">Drag and drop files here, or click to select files</p>
            <button className="btn btn-outline mt-4">Select Files</button>
          </div>
          
          <div className="divider">Recent Assets</div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                <figure className="px-4 pt-4">
                  <div className="bg-base-300 h-32 w-full rounded-lg flex items-center justify-center">
                    <FileImage className="h-10 w-10 text-base-content/50" />
                  </div>
                </figure>
                <div className="card-body p-4">
                  <h3 className="card-title text-sm">Image-{item}.jpg</h3>
                  <p className="text-xs text-base-content/70">Uploaded on 2023-05-{10 + item}</p>
                  <div className="card-actions justify-end mt-2">
                    <button className="btn btn-xs btn-ghost">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="btn btn-xs btn-ghost text-error">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <div className="join">
              <button className="join-item btn">«</button>
              <button className="join-item btn">1</button>
              <button className="join-item btn btn-active">2</button>
              <button className="join-item btn">3</button>
              <button className="join-item btn">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}