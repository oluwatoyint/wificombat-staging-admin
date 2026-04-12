import axiosInstance from './axiosInstance';

/**
 * Helper function for GET requests
 * @param {string} url - The endpoint to request
 * @param {object} params - Query parameters for the request
 * @returns {Promise} - Axios response
 */
export const get = async (url, params = {}) => {
  try {
    const response = await axiosInstance.get(url, { params });
    return response;
  } catch (error) {
    handleAxiosError(error);
    throw error; // Re-throw the error for further handling
  }
};

/**
 * Helper function for POST requests
 * @param {string} url - The endpoint to request
 * @param {object} data - Request body
 * @returns {Promise} - Axios response
 */
export const post = async (url, data = {}) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Helper function for PUT requests
 * @param {string} url - The endpoint to request
 * @param {object} data - Request body
 * @returns {Promise} - Axios response
 */
export const put = async (url, data = {}) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Helper function for DELETE requests
 * @param {string} url - The endpoint to request
 * @returns {Promise} - Axios response
 */
export const remove = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Helper function for file uploads
 * @param {string} url - The endpoint to upload to
 * @param {File|Blob} file - The file to upload
 * @param {string} fileFieldName - The field name for the file (default: 'media')
 * @param {string} fileFieldType - The field name for the file type (default: 'photo')
 * @param {object} additionalData - Additional form data to include
 * @returns {Promise} - Axios response
 */
export const uploadFile = async (
  url,
  file,
  fileFieldType,
) => {
  try {
    // Create FormData instance
    const formData = new FormData();
    console.log(file);
    
    // Append the file
    formData.append("media", file);
    formData.append("media_type", fileFieldType);

    // Create config object with headers and progress tracking
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    };

    console.log(url, formData, config);
    

    const response = await axiosInstance.post(url, formData, config);
    return response;
  } catch (error) {
    handleAxiosError(error);
    throw error;
  }
};

/**
 * Centralized error handling for Axios
 * @param {object} error - Axios error object
 */
const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    console.log('Error Response:', error.response.data);
    console.log('Error Status:', error.response.status);
    // return error
  } else if (error.request) {
    // No response received
    console.log('Error Request:', error.request);
  } else {
    // Something else caused the error
    console.log('Error Message:', error.message);
  }

  // Optional: Add specific error handling logic
  if (error.response?.status === 401) {
    console.log('Unauthorized! Redirecting to login...');
    window.location.href = '/login';
  }
};
