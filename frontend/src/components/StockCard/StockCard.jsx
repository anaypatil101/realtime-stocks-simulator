import React from 'react';
import { Link } from 'react-router-dom';
import CurrentPrice from '../CurrentPrice/CurrentPrice';
import PriceChart from '../PriceChart/PriceChart';

const StockCard = ({ socket, stock }) => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-xl shadow-md">

      {/* Clickable area: banner + name + price + chart */}
      <Link to={`/stock/${stock._id}`} className="flex-1 flex flex-col min-h-0">

        {/* Ticker banner — fixed height */}
        <div className="h-28 shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-900 dark:to-gray-900 flex items-center justify-center">
          <span className="text-3xl font-bold text-white tracking-widest">
            {stock.ticker}
          </span>
        </div>

        {/* Company name — fixed height, single line with ellipsis */}
        <div className="h-16 shrink-0 px-4 flex flex-col items-center justify-center text-center">
          <h1 className="w-full text-base font-bold text-gray-800 dark:text-white truncate">
            {stock.name}
          </h1>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {stock.exchange} : {stock.ticker}
          </span>
        </div>

        {/* Price + chart — fills remaining space, vertically centred */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 border-t border-gray-100 dark:border-gray-800">
          <CurrentPrice
            currentPrice={stock.currentPrice}
            ticker={stock.ticker}
            socket={socket}
          />
          <div className="my-2" />
          <PriceChart
            id={stock.ticker}
            legendDisplay={false}
            xDisplay={false}
            yDisplay={false}
            socket={socket}
            ticker={stock.ticker}
            currPrice={stock.currentPrice}
            styleSet="h-16 w-32"
          />
        </div>
      </Link>

      {/* Action buttons — pinned to the bottom */}
      <div className="shrink-0 flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800">
        <Link
          to={`/transaction/${stock._id}`}
          className="flex-1 text-center py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 dark:hover:bg-blue-700 focus:outline-none transition-colors duration-150"
        >
          Buy
        </Link>
        <Link
          to={`/stock/${stock._id}`}
          className="flex-1 text-center py-2 text-sm font-semibold text-white bg-gray-500 dark:bg-gray-700 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-150"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default StockCard;
