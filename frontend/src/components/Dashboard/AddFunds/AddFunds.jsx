import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { createPaymentOrder, verifyPayment } from '../../../api/index.js';
import { COINS_TOPPED_UP } from '../../../constants/actions';
import { isGuestUser } from '../../../utils/isGuest';

const PACKAGES = [
  {
    id: 'starter',
    label: 'Starter Pack',
    coins: 50000,
    price: '₹99',
    highlight: false,
    description: 'Perfect for getting started',
  },
  {
    id: 'trader',
    label: 'Trader Pack',
    coins: 125000,
    price: '₹199',
    highlight: true,
    description: 'Most popular — great value',
  },
  {
    id: 'pro',
    label: 'Pro Pack',
    coins: 350000,
    price: '₹499',
    highlight: false,
    description: 'For serious simulators',
  },
];

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const AddFunds = ({ user }) => {
  const guest = isGuestUser();
  const dispatch = useDispatch();

  if (guest) {
    return (
      <div className="bg-white dark:bg-gray-900 pt-6">
        <section className="w-full p-6 mx-auto bg-white dark:bg-gray-900 divide divide-y">
          <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-gray-200 pb-4">Add Funds</h2>
          <div className="pt-6 flex flex-col items-center text-center gap-4">
            <svg className="h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Adding funds is not available for guest accounts. Create a free account to top up your virtual balance.
            </p>
            <Link
              to="/auth"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-150"
            >
              Create an Account
            </Link>
          </div>
        </section>
      </div>
    );
  }
  const [selectedPkg, setSelectedPkg] = useState('trader');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTopUp = async () => {
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMsg('Failed to load Razorpay. Please check your internet connection.');
        return;
      }

      const { data: order } = await createPaymentOrder(selectedPkg);

      const options = {
        key: import.meta.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Realtime Stock Simulator',
        description: `${order.packageLabel} — ${order.coins.toLocaleString()} coins`,
        order_id: order.orderId,
        prefill: {
          name: user?.result?.name ?? '',
          email: user?.result?.email ?? '',
        },
        theme: { color: '#3B82F6' },
        handler: async (response) => {
          try {
            const { data: result } = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              packageId: selectedPkg,
            });
            dispatch({ type: COINS_TOPPED_UP, data: { coins: result.coins } });
            setErrorMsg('');
            setSuccessMsg(result.message);
          } catch {
            setSuccessMsg('');
            setErrorMsg('Payment was received but verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setSuccessMsg('');
        setErrorMsg(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Something went wrong. Please try again.';
      setErrorMsg(msg);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 pt-6">
      <div className="container flex flex-col justify-center">
        <section className="w-full p-6 mx-auto bg-white dark:bg-gray-900 divide divide-y">
          <h2 className="text-lg font-semibold text-gray-700 capitalize dark:text-gray-200 pb-4">
            Add Funds
          </h2>

          <div className="pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Top up your virtual coin balance using Razorpay. This is a simulated purchase using
              Razorpay Test Mode — no real money is charged.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-150 focus:outline-none ${
                    selectedPkg === pkg.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  {pkg.highlight && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-semibold bg-blue-500 text-white rounded-full">
                      Best Value
                    </span>
                  )}
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">
                    {pkg.label}
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {pkg.price}
                  </span>
                  <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mt-1">
                    ${pkg.coins.toLocaleString()} coins
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {pkg.description}
                  </span>
                </button>
              ))}
            </div>

            {successMsg && (
              <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
                <svg className="h-5 w-5 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-700 dark:text-green-300">{successMsg}</p>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700">
                <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300">{errorMsg}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleTopUp}
              disabled={loading}
              className="w-full px-6 py-2.5 leading-5 text-white font-medium transition-colors duration-200 bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing…
                </>
              ) : (
                `Pay ${PACKAGES.find((p) => p.id === selectedPkg)?.price} & Add Coins`
              )}
            </button>

            <p className="mt-3 text-xs text-center text-gray-400 dark:text-gray-500">
              Secured by Razorpay · Test mode — use Netbanking (any bank) or UPI ID: success@razorpay
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddFunds;
