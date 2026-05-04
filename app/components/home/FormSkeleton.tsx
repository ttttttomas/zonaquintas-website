import React from "react";

export default function FormSkeleton() {
  return (
    <div className="flex xl:pl-20 md:flex-row flex-col justify-center items-center gap-5 md:gap-8 mb-5 md:mb-10 animate-pulse">
      <div className="flex divide-x divide-gray-100 md:flex-row flex-col border border-gray-200 bg-white rounded-full shadow-sm w-full md:w-auto max-w-4xl overflow-hidden">
        {/* Lugar Section */}
        <div className="w-[220px] px-6 py-4 flex flex-col gap-2">
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <div className="h-5 w-32 bg-gray-100 rounded" />
        </div>
        
        {/* Check-in Section */}
        <div className="w-[160px] px-6 py-4 flex flex-col gap-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-100 rounded" />
        </div>
        
        {/* Check-out Section */}
        <div className="w-[160px] px-6 py-4 flex flex-col gap-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-24 bg-gray-100 rounded" />
        </div>
        
        {/* Guests Section */}
        <div className="w-[170px] px-6 py-4 flex flex-col gap-2">
          <div className="h-3 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-28 bg-gray-100 rounded" />
        </div>
      </div>
      
      {/* Search Button Section */}
      <div className="w-14 h-14 bg-gray-200 rounded-full shrink-0" />
    </div>
  );
}
