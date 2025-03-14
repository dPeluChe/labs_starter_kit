import React from 'react';

export default function Gallery() {
  return (
    <div id="gallery" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-base-content">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-base-300 h-64 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg">
              <span className="text-base-content/60">Image Placeholder {item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}