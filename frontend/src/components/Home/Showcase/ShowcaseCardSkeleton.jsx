import React from "react";

const ShowcaseCardSkeleton = () => {
  return (
    <>
      {[...Array(3).keys()].map((index) => (
        <div
          key={index}
          className="w-full flex flex-col overflow-hidden bg-gray-200 dark:bg-gray-900 rounded-xl shadow-md animate-pulse"
        >
          {/* Banner */}
          <div className="h-28 shrink-0 bg-gray-300 dark:bg-gray-700" />

          {/* Name */}
          <div className="h-16 shrink-0 px-4 flex flex-col items-center justify-center gap-2">
            <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Price + chart */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-4 border-t border-gray-300 dark:border-gray-800">
            <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-16 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>

          {/* Buttons */}
          <div className="shrink-0 flex gap-2 px-4 py-3 border-t border-gray-300 dark:border-gray-800">
            <div className="flex-1 h-9 bg-gray-300 dark:bg-gray-700 rounded-lg" />
            <div className="flex-1 h-9 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ShowcaseCardSkeleton;
