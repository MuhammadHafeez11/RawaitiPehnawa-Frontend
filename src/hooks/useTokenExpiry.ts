import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const useTokenExpiry = () => {
  const { logout, user } = useAuth();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('accessToken');
      if (!token || !user) return;

      try {
        // Check if token has proper JWT format
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          // Not a proper JWT, skip expiry check
          return;
        }

        // Decode JWT token to check expiry
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Check if payload has expiry
        if (!payload.exp) {
          // No expiry in token, skip check
          return;
        }

        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;

        // Show warning 30 minutes before expiry
        if (timeUntilExpiry > 0 && timeUntilExpiry < 1800) { // 30 minutes
          toast('Session will expire soon. Please save your work.', {
            icon: '⚠️',
            duration: 5000,
          });
        }

        // Auto logout when token expires
        if (timeUntilExpiry <= 0) {
          toast.error('Session expired. Please login again.');
          logout();
        }
      } catch (error) {
        // Token decode failed, but don't logout - just skip expiry check
        console.warn('Token expiry check skipped - invalid format');
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    
    // Check immediately
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [user, logout]);
};

export default useTokenExpiry;