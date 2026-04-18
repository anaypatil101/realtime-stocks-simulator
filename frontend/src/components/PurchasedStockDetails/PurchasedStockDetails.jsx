import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import { getStock } from '../../actions/stocks';
import { getPurchase } from '../../actions/purchased';
import { useParams } from "react-router";
import CurrentPrice from "../CurrentPrice/CurrentPrice";
import InvestmentPrice from "../InvestmentPrice/InvestmentPrice";
import PurchasedStockDetailsSkeleton from "./PurchasedStockDetailsSkeleton";

const PurchasedStockDetails = () => {
	const socket = useMemo(
		() => socketIOClient(import.meta.env.REACT_APP_STOCKS_API, { transports: ['websocket', 'polling', 'flashsocket'] }),
		[]
	);
	const purchase = useSelector((state) => state.purchasedReducer);
	const stock = useSelector((state) => state.stocksReducer);
	const dispatch = useDispatch();
	const { id } = useParams();
	const { state } = useLocation();

	useEffect(() => {
		dispatch(getPurchase(id));
	}, [dispatch, id]);

	useEffect(() => {
		dispatch(getStock(id));
	}, [dispatch, id]);

	useEffect(() => {
		socket.connect();
		return () => {
			socket.disconnect();
		};
	}, [socket]);

	return (
		!purchase?._id || !stock?._id ? <PurchasedStockDetailsSkeleton /> :
			<div className="bg-white dark:bg-gray-800 pt-24 lg:pt-16 md:pt-32 sm:pt-32">
				<div className="container flex flex-col px-6 py-4 mx-auto space-y-6 lg:py-16 lg:flex-row lg:items-start lg:space-y-0 lg:space-x-6">

					{/* Left — investment info */}
					<div className="flex flex-col items-start w-full lg:w-1/2">
						<div className="max-w-lg lg:mx-12">
							<h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-white lg:text-4xl">
								Investing {purchase.shares} {purchase.shares > 1 ? 'shares' : 'share'} in{' '}
								<strong>{stock.exchange} : {purchase.tickerBought}</strong>
							</h1>
							<p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{stock.description}</p>

							<div className="flex flex-col sm:flex-row items-start gap-8 mt-6">
								<div>
									<h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
										Initial Investment
									</h2>
									<span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
										<span aria-hidden="true" className="absolute inset-0 bg-blue-200 dark:bg-blue-700 opacity-50 rounded-full" />
										<span className="relative text-blue-600 dark:text-blue-400">
											${parseFloat(purchase.initialInvestment).toFixed(2)}
										</span>
									</span>
								</div>

								<div>
									<h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
										Total Value
									</h2>
									<InvestmentPrice
										shares={purchase.shares}
										ticker={purchase.tickerBought}
										initialInvestment={purchase.initialInvestment}
										socket={socket}
									/>
								</div>

								<div>
									<h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
										Shares Bought
									</h2>
									<span className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
										<span aria-hidden="true" className="absolute inset-0 bg-blue-200 dark:bg-blue-700 opacity-50 rounded-full" />
										<span className="relative text-blue-600 dark:text-blue-400">
											{purchase.shares} shares
										</span>
									</span>
								</div>
							</div>

							<div className="mt-6">
								<h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
									Purchase Hash
								</h2>
								<span className="relative inline-block px-3 py-1 font-semibold text-indigo-900 leading-tight">
									<span aria-hidden="true" className="absolute inset-0 bg-indigo-200 dark:bg-indigo-700 opacity-50 rounded-full" />
									<span className="relative text-indigo-600 dark:text-indigo-400 text-sm break-all">
										#{purchase.stock}
									</span>
								</span>
							</div>

							{state && (
								<div
									onClick={() => { window.history.replaceState({}, document.title); window.location.reload(); }}
									className="cursor-pointer mt-6 flex overflow-hidden bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg"
								>
									<div className="flex items-center justify-center w-10 shrink-0 bg-blue-500">
										<svg className="w-5 h-5 text-white fill-current" viewBox="0 0 40 40">
											<path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z" />
										</svg>
									</div>
									<p className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
										<strong className="text-blue-500 dark:text-blue-400">Info:</strong> Looks like you just bought / updated this investment. Your funds may not be updated yet. Click here to refresh.
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Right — live price card */}
					<div className="flex items-start justify-center w-full lg:w-1/2">
						<div className="w-full max-w-md overflow-hidden bg-white rounded-xl shadow-lg dark:bg-gray-800">

							{/* Ticker banner */}
							<div className="h-28 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-900 dark:to-gray-900 flex items-center justify-center">
								<span className="text-4xl font-bold text-white tracking-widest opacity-90">
									{stock.ticker}
								</span>
							</div>

							<div className="px-6 py-5 space-y-4">
								<div className="flex items-center justify-between text-gray-700 dark:text-gray-200">
									<span className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
										Current Price
									</span>
									<CurrentPrice currentPrice={stock.currentPrice} ticker={stock.ticker} socket={socket} />
								</div>

								<div className="flex items-center justify-between text-gray-700 dark:text-gray-200">
									<span className="text-sm font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
										Trend
									</span>
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

								<div className="flex flex-wrap gap-2 pt-2">
									<Link
										to={`/transaction/${stock._id}`}
										className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-blue-500 dark:bg-blue-700 rounded-lg hover:bg-blue-600 focus:outline-none transition-colors duration-150"
									>
										Buy / Sell Shares
									</Link>
									<Link
										to={`/stock/${stock._id}`}
										className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-gray-400 dark:bg-gray-700 rounded-lg hover:bg-gray-500 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-150"
									>
										Stock Details
									</Link>
								</div>
							</div>
						</div>
					</div>

				</div>
			</div>
	);
};

export default PurchasedStockDetails;
