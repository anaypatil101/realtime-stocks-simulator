import React from "react";
import { Link } from 'react-router-dom';
import Step1 from '../../assets/images/step1.svg';
import Step2 from '../../assets/images/step2.svg';
import Step3 from '../../assets/images/step3.svg';
import Step4 from '../../assets/images/step4.svg';

const Guide = () => {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 pt-24">
        <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-24 lg:px-8 z-20">
          <h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
            <span className="block">
              The Official Realtime Stock Simulator Guide.
            </span>
          </h2>
          <p className="text-xl mt-4 max-w-full mx-auto text-gray-400">
            Follow the guide below to get started with Realtime Stock Simulator and invest today!
          </p>
        </div>
      </div>

      {/* Step 1: Log In */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container px-16 sm:px-32 py-16 sm:py-16 mx-auto">
          <div className="items-center flex flex-col lg:flex-row">
            <div className="lg:w-1/2 dark:bg-gray-900 p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Step 1: Log Into Realtime Stock Simulator</h2>
              <p className="my-4 text-gray-500 dark:text-gray-400 lg:max-w-full">
                Log in to your Realtime Stock Simulator account. If you don't have an account, you can create one by clicking the button below. Every new account starts with <strong>$100,000</strong> in virtual currency.
              </p>
              <Link to="/auth" className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md dark:bg-blue-800 hover:bg-blue-500 dark:hover:bg-blue-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-blue-700">
                Login
              </Link>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <div className="flex items-center justify-center lg:justify-end">
                <div className="max-w-md">
                  <img className="opacity-90 object-contain object-center w-full h-72" src={Step1} alt="step 1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Browse Stocks */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container px-16 sm:px-32 py-16 sm:py-16 mx-auto">
          <div className="items-center flex flex-col-reverse lg:flex-row">
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <div className="flex items-center justify-center lg:justify-start">
                <div className="max-w-md">
                  <img className="opacity-90 object-contain object-center w-full h-72" src={Step2} alt="step 2" />
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 dark:bg-gray-900 p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Step 2: Browse Stocks</h2>
              <p className="my-4 text-gray-500 dark:text-gray-400 lg:max-w-full">
                Head to the Markets page to explore our collection of stocks. Prices update every few seconds via WebSockets, giving you a real-time feel of the market.
              </p>
              <Link to="/markets" className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md dark:bg-blue-800 hover:bg-blue-500 dark:hover:bg-blue-700 focus:outline-none focus:bg-blue-500 dark:focus:bg-blue-700">
                Browse Markets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Check AI Signal — BEFORE buying */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container px-16 sm:px-32 py-16 sm:py-16 mx-auto">
          <div className="items-center flex flex-col lg:flex-row">
            <div className="lg:w-1/2 dark:bg-gray-800 p-8 rounded-lg shadow">
              <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full uppercase tracking-wide">AI Feature</span>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Step 3: Check the AI Buy Signal</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 lg:max-w-full">
                Before investing, open any stock's detail page and scroll down to the <strong>AI Signal</strong> section. Our Groq-powered AI analyses recent price history and tells you whether it's a <em>Perfect Time to Buy</em>, <em>Good</em>, <em>Risky</em>, or <em>Avoid</em> — helping you make a smarter decision before committing your coins.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <div className="flex items-center justify-center lg:justify-end">
                <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">AI Signal</p>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">↑</span>
                    <span className="text-base font-bold text-green-600 dark:text-green-400">Perfect Time to Buy</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">Price recently dipped and is showing strong recovery momentum over the last 10 records.</p>
                  <p className="mt-3 text-xs text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-3">For educational purposes only. Not financial advice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Make a Transaction */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container px-16 sm:px-32 py-16 sm:py-16 mx-auto">
          <div className="items-center flex flex-col-reverse lg:flex-row">
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <div className="flex items-center justify-center lg:justify-start">
                <div className="max-w-md">
                  <img className="opacity-90 object-contain object-center w-full h-72" src={Step3} alt="step 4" />
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 dark:bg-gray-900 p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Step 4: Make a Transaction</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 lg:max-w-full">
                Once the AI signal looks good, buy up to 100 shares using your virtual currency. Note that live price updates may affect the amount needed — act fast when the signal is right!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 5: Sit Back and Invest */}
      <section className="bg-white dark:bg-gray-800">
        <div className="container px-16 sm:px-32 py-16 sm:py-16 mx-auto">
          <div className="items-center flex flex-col lg:flex-row">
            <div className="lg:w-1/2 dark:bg-gray-900 p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Step 5: Sit Back and Invest</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 lg:max-w-full">
                You're invested! Head to your <strong>Investments</strong> page to monitor your portfolio, track profit/loss in real time, and sell at any point.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <div className="flex items-center justify-center lg:justify-end">
                <div className="max-w-md">
                  <img className="opacity-90 object-contain object-center w-full h-72" src={Step4} alt="step 5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 6: Add Funds */}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="container px-16 sm:px-32 py-16 sm:py-16 mx-auto">
          <div className="items-center flex flex-col-reverse lg:flex-row">
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <div className="flex items-center justify-center lg:justify-start">
                <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow">
                  <div className="grid grid-cols-3 gap-3">
                    {[{ label: 'Starter', price: '₹99', coins: '50,000' }, { label: 'Trader', price: '₹199', coins: '1,25,000' }, { label: 'Pro', price: '₹499', coins: '3,50,000' }].map((pkg) => (
                      <div key={pkg.label} className="flex flex-col items-center text-center p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{pkg.label}</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">{pkg.price}</span>
                        <span className="text-xs text-yellow-600 dark:text-yellow-400">${pkg.coins}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-center text-gray-400 dark:text-gray-500">Secured by Razorpay · Test mode</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 dark:bg-gray-800 p-8 rounded-lg shadow">
              <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full uppercase tracking-wide">Payments</span>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Step 6: Top Up with Add Funds</h2>
              <p className="mt-4 text-gray-500 dark:text-gray-400 lg:max-w-full">
                Running low on virtual coins? Click the green <strong>+ Add Funds</strong> button in the navigation bar or go to <strong>Dashboard → Add Funds</strong>. Choose a coin package and complete a secure Razorpay payment to instantly credit your balance and keep investing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Guide;
