import axios from 'axios';

/**
 * Extracts a human-readable error message from an axios error or any unknown error.
 *
 * Usage:
 *   } catch (err) {
 *     setError(extractApiError(err, 'Failed to load jobs'));
 *   }
 */
export const extractApiError = (
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string => {
  if (axios.isAxiosError(err)) {
    // Prefer the structured `error` field our backend always returns
    const serverMessage = err.response?.data?.error;
    if (typeof serverMessage === 'string' && serverMessage.length > 0) {
      return serverMessage;
    }
    // Network / timeout errors
    if (err.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
    if (!err.response) return 'Network error. Please check your connection.';
  }
  return fallback;
};
