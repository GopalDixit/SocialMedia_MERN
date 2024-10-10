import axios from 'axios';

const API_URL = 'https://socialmedia-mern-509c.onrender.com'; 

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
    return response.data; 
  } catch (error) {
    throw new Error(error.response.data.message || 'Error commenting on post');
  }
};
