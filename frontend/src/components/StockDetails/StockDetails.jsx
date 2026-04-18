import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { getStock } from '../../actions/stocks';
import { fetchStockSignal } from '../../api/index';
import StockDetailsSkeleton from "./StockDetailsSkeleton";
import StockSignalCard from "./StockSignalCard";
import CurrentPrice from "../CurrentPrice/CurrentPrice";
import PriceChart from "../PriceChart/PriceChart";

const StockDetails = (props) => {
  const { id } = props;
  const socket = useMemo(
    () => socketIOClient(import.meta.env.REACT_APP_STOCKS_API, { transports: ['websocket', 'polling', 'flashsocket'] }),
    []
  );
  const stock = useSelector((state) => state.stocksReducer);
  const dispatch = useDispatch();

  const [signalData, setSignalData] = useState(null);
  const [signalLoading, setSignalLoading] = useState(true);
  const [signalError, setSignalError] = useState(null);

  useEffect(() => {
    dispatch(getStock(id));
  }, [dispatch, id]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (!id) return;
    setSignalLoading(true);
    setSignalError(null);
    fetchStockSignal(id)
      .then(({ data }) => setSignalData(data))
      .catch(() => setSignalError('Unable to load AI signal. Please try again later.'))
      .finally(() => setSignalLoading(false));
  }, [id]);

  return (
    !stock?._id ?
      <StockDetailsSkeleton />
      :
      <div className="bg-white dark:bg-gray-800 pt-24 lg:pt-16 md:pt-32 sm:pt-32">
        <div className="container flex flex-col px-6 py-4 mx-auto space-y-6 lg:py-16 lg:flex-row lg:items-start lg:space-y-0 lg:space-x-6">

          {/* Left — stock info + AI signal */}
          <div className="flex flex-col items-start w-full lg:w-1/2">
            <div className="max-w-lg lg:mx-12 w-full">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-800 dark:text-white lg:text-4xl">
                {stock.name}{' '}
                <span className="font-bold">— {stock.exchange} : {stock.ticker}</span>
              </h1>
              <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{stock.description}</p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-6">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    Current Price
                  </h2>
                  <CurrentPrice currentPrice={stock.currentPrice} ticker={stock.ticker} socket={socket} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    All Time Change
                  </h2>
                  {(stock.currentPrice / stock.initialPrice).toFixed(2) > 1 ? (
                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                      <span aria-hidden="true" className="absolute inset-0 bg-green-200 dark:bg-green-700 opacity-50 rounded-full" />
                      <span className="relative text-green-600 dark:text-green-400">
                        +{Math.abs((1 - (stock.currentPrice / stock.initialPrice)) * 100).toFixed(2)}% up
                      </span>
                    </span>
                  ) : (
                    <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                      <span aria-hidden="true" className="absolute inset-0 bg-red-200 dark:bg-red-700 opacity-50 rounded-full" />
                      <span className="relative text-red-600 dark:text-red-400">
                        -{Math.abs((1 - (stock.currentPrice / stock.initialPrice)) * 100).toFixed(2)}% down
                      </span>
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    Trend
                  </h2>
                  <PriceChart
                    id={stock.ticker}
                    legendDisplay={false}
                    xDisplay={false}
                    yDisplay={false}
                    socket={socket}
                    ticker={stock.ticker}
                    currPrice={stock.currentPrice}
                    styleSet="h-24 w-48"
                  />
                </div>
              </div>

              {/* AI Signal */}
              <StockSignalCard
                signal={signalData?.signal}
                reason={signalData?.reason}
                disclaimer={signalData?.disclaimer}
                isLoading={signalLoading}
                error={signalError}
              />
            </div>
          </div>

          {/* Right — company details card */}
          <div className="flex items-start justify-center w-full lg:w-1/2">
            <div className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-lg dark:bg-gray-800">

              {/* Ticker banner */}
              <div className="h-28 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-900 dark:to-gray-900 flex items-center justify-center">
                <span className="text-4xl font-bold text-white tracking-widest opacity-90">
                  {stock.ticker}
                </span>
              </div>

              {/* Company website bar */}
              <div className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <a
                  href={stock.siteURL}
                  className="ml-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Company Website
                </a>
              </div>

              {/* Details */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span className="ml-2 text-sm">Ticker: <strong>{stock.ticker}</strong></span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="ml-2 text-sm">Exchange: <strong>{stock.exchange}</strong></span>
                </div>

                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="ml-2 text-sm">IPO Date: <strong>{stock.ipoDate}</strong></span>
                </div>

                <div className="flex items-start text-gray-700 dark:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2 text-sm">Industries: <strong>{stock.industries.join(', ')}</strong></span>
                </div>

                <div className="flex flex-wrap gap-2 pt-3">
                  <Link
                    to={`/transaction/${stock._id}`}
                    className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-blue-500 dark:bg-blue-700 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 focus:outline-none transition-colors duration-150"
                  >
                    Buy
                  </Link>
                  <Link
                    to="/markets"
                    className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-gray-400 dark:bg-gray-700 rounded-lg hover:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-150"
                  >
                    Back to Markets
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  );
};

export default StockDetails;
