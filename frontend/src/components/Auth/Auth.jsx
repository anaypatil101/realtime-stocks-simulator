import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { loginUser, registerUser } from '../../actions/auth';
import { AUTH_ERROR_OCCURRED } from '../../constants/actions';

const initialState = { firstName: '', lastName: '', email: '', password: '' };

const inputClass =
  'block w-full px-4 py-2 mt-2 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent dark:focus:ring-blue-500 transition-colors duration-150';

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
    <div className="font-inter bg-white dark:bg-gray-800 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="px-6 py-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white tracking-tight">
            Realtime Stock Simulator
          </h2>
          <h3 className="mt-1 text-lg font-medium text-center text-gray-500 dark:text-gray-400">
            {isSignup ? 'Create an account' : 'Welcome back'}
          </h3>

          <form onSubmit={handleSubmit} name="auth_form" className="mt-5 space-y-4">
            {isSignup && (
              <>
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
              </>
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
              <div className="flex overflow-hidden bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center justify-center w-10 shrink-0 bg-red-500 dark:bg-red-700">
                  <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 40 40">
                    <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                  </svg>
                </div>
                <p className="px-3 py-2 text-sm text-red-600 dark:text-red-300">{errors}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gray-800 dark:bg-gray-600 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-150"
            >
              {isLoading && !errors && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSignup ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <span className="flex-1 border-t border-gray-300 dark:border-gray-600" />
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">
              or continue as guest
            </span>
            <span className="flex-1 border-t border-gray-300 dark:border-gray-600" />
          </div>

          <form onSubmit={handleSubmitGuestAccount}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-150"
            >
              {isLoadingGuest && !errors && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Try with Guest Account
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 py-4 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {!isSignup ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button
            onClick={switchMode}
            className="text-sm font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150"
          >
            {!isSignup ? 'Register' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
