// src/components/Post.jsx
import React, { useState } from 'react';
import { commentOnPost } from '../api'; 

const Post = ({ post, userId }) => {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await commentOnPost(post._id, userId, comment);
      console.log('Comment added:', response);
      setComment(''); // Clear the comment input
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h3>{post.content}</h3>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button type="submit">Comment</button>
      </form>
      {/* Display comments here */}
    </div>
  );
};

export default Post;
