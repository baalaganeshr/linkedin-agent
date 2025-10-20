// Retry utility for API requests with exponential backoff
/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {number} retries - Number of retry attempts (default: 3)
 * @param {number} delay - Initial delay in ms (default: 1000)
 * @param {Function} shouldRetry - Optional function to determine if error should be retried
 * @returns {Promise} - Result of the function call
 */
export const retryRequest = async (
  fn,
  retries = 3,
  delay = 1000,
  shouldRetry = null
) => {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      // Attempt the request
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (i === retries - 1) {
        break;
      }

      // Don't retry on client errors (4xx), only on server errors (5xx) and network errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      // Calculate exponential backoff with jitter
      const backoffDelay = delay * Math.pow(2, i);
      const jitter = Math.random() * 0.3 * backoffDelay; // Add up to 30% jitter
      const totalDelay = backoffDelay + jitter;

      console.log(
        `Request failed (attempt ${i + 1}/${retries}). Retrying in ${Math.round(
          totalDelay
        )}ms...`
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, totalDelay));
    }
  }

  // All retries failed, throw the last error
  throw lastError;
};

/**
 * Retry with custom should retry logic for specific status codes
 */
export const retryOnNetworkError = (error) => {
  // Retry on network errors or 5xx server errors
  return (
    !error.response || // Network error
    error.response.status >= 500 // Server error
  );
};

/**
 * Wrapper for axios requests with retry logic
 */
export const retryAxiosRequest = async (axiosConfig, retries = 3) => {
  return retryRequest(
    async () => {
      const axios = require('axios');
      return await axios(axiosConfig);
    },
    retries,
    1000,
    retryOnNetworkError
  );
};

/**
 * Create a retry-enabled version of an async function
 */
export const withRetry = (fn, retries = 3, delay = 1000) => {
  return async (...args) => {
    return retryRequest(() => fn(...args), retries, delay);
  };
};

export default {
  retryRequest,
  retryOnNetworkError,
  retryAxiosRequest,
  withRetry,
};
