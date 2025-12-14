import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-nest-bg animate-pulse">
      {/* Navbar Placeholder */}
      <div className="sticky top-0 z-50 py-4 px-4 md:px-8 bg-nest-bg/90 backdrop-blur-md border-b border-gray-200/50">
        <div className="flex items-center justify-between gap-4">
          {/* Logo Pill */}
          <div className="w-32 h-12 bg-gray-200 rounded-full"></div>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl h-12 bg-white/50 rounded-full"></div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content Placeholder */}
      <div className="p-4 md:px-8 max-w-[1600px] mx-auto space-y-8 mt-4 pb-12">
        
        {/* Header Text */}
        <div className="space-y-3 mb-8">
           <div className="w-1/3 h-10 bg-gray-200 rounded-lg"></div>
           <div className="w-1/4 h-5 bg-gray-200/60 rounded-lg"></div>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[500px]">
          <div className="lg:col-span-8 bg-gray-200 rounded-[2rem]"></div>
          <div className="lg:col-span-4 bg-gray-200 rounded-[2rem]"></div>
        </div>

        {/* Features Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="h-24 bg-white rounded-[2rem] border border-gray-100"></div>
           <div className="h-24 bg-white rounded-[2rem] border border-gray-100"></div>
           <div className="h-24 bg-white rounded-[2rem] border border-gray-100"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[440px] bg-white rounded-[2rem] p-4 border border-gray-100 flex flex-col">
               <div className="h-[280px] bg-gray-100 rounded-[1.5rem] mb-6"></div>
               <div className="space-y-3 px-2">
                 <div className="h-6 w-3/4 bg-gray-100 rounded"></div>
                 <div className="flex justify-between items-center">
                    <div className="h-5 w-1/4 bg-gray-100 rounded"></div>
                    <div className="h-8 w-16 bg-gray-100 rounded-lg"></div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;