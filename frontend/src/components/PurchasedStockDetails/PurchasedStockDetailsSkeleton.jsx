import React from "react";

const PurchasedStockDetailsSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 pt-24 lg:pt-16 md:pt-32 sm:pt-32">
      <div className="container flex flex-col px-6 py-4 mx-auto space-y-6 lg:py-16 lg:flex-row lg:items-start lg:space-y-0 lg:space-x-6 animate-pulse">

        {/* Left skeleton */}
        <div className="flex flex-col items-start w-full lg:w-1/2">
          <div className="max-w-lg w-full lg:mx-12 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3" />
            <div className="flex gap-8 mt-6">
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-600 rounded-full" />
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-600 rounded-full" />
              <div className="h-10 w-24 bg-gray-200 dark:bg-gray-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right skeleton */}
        <div className="flex items-start justify-center w-full lg:w-1/2">
          <div className="w-full max-w-md overflow-hidden rounded-xl shadow-lg">
            <div className="h-28 bg-gray-300 dark:bg-gray-700 rounded-t-xl" />
            <div className="bg-gray-100 dark:bg-gray-800 px-6 py-5 space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded-full" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-600 rounded-lg" />
                <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-600 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PurchasedStockDetailsSkeleton;
