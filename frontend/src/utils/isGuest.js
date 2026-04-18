/**
 * Returns true if the currently logged-in user is the guest account.
 * Compares the stored email against the base64-encoded guest email env var.
 */
export const isGuestUser = () => {
  try {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (!profile?.result?.email) return false;
    const guestEmail = atob(import.meta.env.REACT_APP_GUEST_EMAIL || '');
    return profile.result.email === guestEmail;
  } catch {
    return false;
  }
};
