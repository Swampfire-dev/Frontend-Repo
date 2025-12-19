import logger from '../utils/logger';  
import API_URLS from '../config/apiUrls';
import API_TIMEOUTS from '../config/apiTimeouts';

const apiRequest = async (url, options, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // Log the request details
    logger.debug('Sending request to', { url, options });

    // Perform the fetch request
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      credentials: 'include', 
    });

    // If the response is not OK, log the error and throw an exception
    if (!response.ok) {
      logger.error('API request failed', { url, status: response.status, statusText: response.statusText });
      throw new Error(`Error: ${response.statusText}`);
    }

    // Log the successful response
    const responseData = await response.json();
    logger.debug('API response received', { url, responseData });
    

    return responseData;
  } catch (error) {
    // Handle timeout error specifically
    if (error.name === 'AbortError') {
      logger.error('API request timed out', { url, error: error.message });
      throw new Error('Request timed out');
    }

    // Log any other errors
    logger.error('API request error', { url, error: error.message });
    throw new Error(error.message || 'Something went wrong');
  } finally {
    // Clear timeout after request is completed or aborted
    clearTimeout(timeoutId);
  }
};

// 1. Create a new training
export const createTraining = async (trainingData) => {
  const url = API_URLS.TRAINING.CREATE;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trainingData),
  };

  // Log the training data before making the API call
  logger.info('Creating certificate with data', { trainingData });

  try {
    const result = await apiRequest(url, options, API_TIMEOUTS.TRAINING.CREATE);  
    logger.success('Training created successfully', { result });
    return result;
  } catch (error) {
    logger.error('Failed to create Training', { error: error.message });
    throw error;
  }
};

// 2. Fetch the list of training
export const fetchTraining = async () => {
  const url = API_URLS.TRAINING.LIST;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Log the API call
  logger.info('Fetching training list');

  try {
    const result = await apiRequest(url, options, API_TIMEOUTS.TRAINING.LIST);
    logger.success('Fetched training successfully', { result });
    return result;
  } catch (error) {
    logger.error('Failed to fetch training data', { error: error.message });
    throw error;
  }
};

// 3. Fetch certificate statistics
export const fetchTrainingStats = async () => {
  const url = API_URLS.TRAINING.STATS; 
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Log the API call
  logger.info('Fetching training statistics');

  try {
    const result = await apiRequest(url, options, API_TIMEOUTS.TRAINING.STATS);
    logger.success('Fetched training statistics successfully', { result });
    return result;
  } catch (error) {
    logger.error('Failed to fetch training statistics', { error: error.message });
    throw error;
  }
};


// 3. Fetch details of a specific certificate
export const fetchCertificateDetails = async (certId) => {
  const url = API_URLS.CERTIFICATE.DETAIL(certId);
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Log the API call
  logger.info('Fetching certificate details for certId', { certId });

  try {
    const result = await apiRequest(url, options, API_TIMEOUTS.CERTIFICATE.DETAILS);
    logger.success('Fetched certificate details successfully', { result });
    return result;
  } catch (error) {
    logger.error('Failed to fetch certificate details', { certId, error: error.message });
    throw error;
  }
};

// 4. Fetch certificates for a specific partner (PSA ID)
export const fetchPartnerCertificates = async (psaId) => {
  const url = API_URLS.CERTIFICATE.PARTNER_LIST(psaId);
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Log the API call
  logger.info('Fetching partner certificates for PSA ID', { psaId });

  try {
    const result = await apiRequest(url, options, API_TIMEOUTS.CERTIFICATE.PARTNER_LIST);
    logger.success('Fetched partner certificates successfully', { result });
    return result;
  } catch (error) {
    logger.error('Failed to fetch partner certificates', { psaId, error: error.message });
    throw error;
  }
};


// 6. Fetch certificate trends
export const fetchCertificateTrends = async () => {
  const url = API_URLS.CERTIFICATE.TRENDS;
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    logger.info('Fetching certificate stats...');
    const result = await apiRequest(url, options, API_TIMEOUTS.CERTIFICATE.TRENDS);
    logger.success('Fetched certificate trends successfully', { result });
    return result;
  } catch (error) {
    logger.error('Failed to fetch certificate trends', { error: error.message });
    throw error;
  }
};

// 7. Fetch certificate domain trends
export const fetchCertificateDomainTrends = async () => {
  const url = API_URLS.CERTIFICATE.DOMAINTRENDS;
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    logger.info('Fetching certificate domain stats...');
    const result = await apiRequest(url, options, API_TIMEOUTS.CERTIFICATE.DOMAIN_TRENDS);
    logger.success('Fetched certificate domain trends successfully', { result });
    return result;
  } catch (error) {
    logger.error('Failed to fetch certificate domain trends', { error: error.message });
    throw error;
  }
};
