import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { loginUser, registerUser } from '../../actions/auth';
import { AUTH_ERROR_OCCURRED } from '../../constants/actions';

const initialState = { firstName: '', lastName: '', email: '', password: '' };

const inputClass =
  'block w-full px-4 py-2.5 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-500 transition-colors duration-150';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const Auth = () => {
  const errors = useSelector((state) => state.authErrorsReducer);
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const { state } = useLocation();

  useEffect(() => {
    dispatch({ type: AUTH_ERROR_OCCURRED, payload: '' });
    return () => {
      dispatch({ type: AUTH_ERROR_OCCURRED, payload: '' });
    };
  }, [dispatch]);

  const switchMode = () => {
    setIsLoading(false);
    dispatch({ type: AUTH_ERROR_OCCURRED, payload: '' });
    const inputs = document.forms['auth_form'].getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
    setIsSignup((prev) => !prev);
  };

  const handleSubmitGuestAccount = async (e) => {
    e.preventDefault();
    setIsLoadingGuest(true);
    dispatch({ type: AUTH_ERROR_OCCURRED, payload: '' });
    try {
      const emailB64 = import.meta.env.REACT_APP_GUEST_EMAIL;
      const passB64 = import.meta.env.REACT_APP_GUEST_PASS;
      if (!emailB64 || !passB64) {
        dispatch({
          type: AUTH_ERROR_OCCURRED,
          payload:
            'Guest login needs REACT_APP_GUEST_EMAIL and REACT_APP_GUEST_PASS in frontend/.env (base64-encoded). Restart the dev server after editing .env.',
        });
        return;
      }
      let email;
      let password;
      try {
        email = atob(emailB64);
        password = atob(passB64);
      } catch {
        dispatch({
          type: AUTH_ERROR_OCCURRED,
          payload: 'REACT_APP_GUEST_EMAIL and REACT_APP_GUEST_PASS must be valid base64 strings.',
        });
        return;
      }
      await dispatch(loginUser({ email, password }, history, state));
    } finally {
      setIsLoadingGuest(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch({ type: AUTH_ERROR_OCCURRED, payload: '' });
    try {
      if (isSignup) {
        await dispatch(registerUser(form, history, state));
      } else {
        await dispatch(loginUser(form, history, state));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="font-inter min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 mb-4">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isSignup
              ? 'Start with $100,000 in virtual currency.'
              : 'Sign in to continue to your portfolio.'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 px-8 py-8">
          <form onSubmit={handleSubmit} name="auth_form" className="space-y-3">
            {isSignup && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={inputClass}
                  required
                  type="text"
                  placeholder="First name"
                  aria-label="First name"
                  name="firstName"
                  onChange={handleChange}
                />
                <input
                  className={inputClass}
                  required
                  type="text"
                  placeholder="Last name"
                  aria-label="Last name"
                  name="lastName"
                  onChange={handleChange}
                />
              </div>
            )}

            <input
              className={inputClass}
              type="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              name="email"
              onChange={handleChange}
            />
            <input
              className={inputClass}
              type="password"
              required
              placeholder="Password"
              aria-label="Password"
              name="password"
              onChange={handleChange}
            />

            {errors && (
              <div className="flex items-start gap-2.5 px-3.5 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <svg className="h-4 w-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed">{errors}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading && !errors}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {isLoading && !errors && <Spinner />}
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">or</span>
            <span className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>

          {/* Guest login */}
          <form onSubmit={handleSubmitGuestAccount}>
            <button
              type="submit"
              disabled={isLoadingGuest && !errors}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
            >
              {isLoadingGuest && !errors ? (
                <svg className="animate-spin h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
              Continue as Guest
            </button>
          </form>
        </div>

        {/* Switch mode */}
        <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={switchMode}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-150"
          >
            {isSignup ? 'Sign in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
