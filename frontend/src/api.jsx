import axios from 'axios';

const API_URL = 'http://localhost:4800'; // Adjust based on your server URL

export const fetchFeed = (userId) => {
  return axios.get(`${API_URL}/feed/${userId}`);
};

export const createPost = (data) => {
  return axios.post(`${API_URL}/post`, data);
};

export const likePost = (postId, userId) => {
  return axios.post(`${API_URL}/like`, { postId, userId });
};

export const commentOnPost = async (postId, userId, comment) => {
  try {
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
      userId,
      comment,
    });
    return response.data; // Return the response data if needed
  } catch (error) {
    throw new Error(error.response.data.message || 'Error commenting on post');
  }
};

// Add other API methods as needed
