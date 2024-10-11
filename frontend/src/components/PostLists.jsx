import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) {
        setError('User ID not found.');
        return;
      }
  
      try {
        const response = await axios.get(`https://socialmedia-mern-509c.onrender.com/feed/${userId}`);
        console.log('Posts Response:', response.data);
        setPosts(response.data.reverse());
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      }
    };
  
    fetchPosts(); 
    const intervalId = setInterval(fetchPosts, 5000); 
  
    return () => clearInterval(intervalId); 
  }, [userId]);
  

  const handleLikeToggle = async (postId, hasLiked) => {
    try {
      const url = hasLiked ? 'https://socialmedia-mern-509c.onrender.com/unlike' : 'https://socialmedia-mern-509c.onrender.com/like';
      await axios.post(url, { postId, userId });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: hasLiked
                  ? post.likes.filter((likeId) => likeId !== userId)
                  : [...post.likes, userId],
              }
            : post
        )
      );
    } catch (err) {
      setError(`Error ${hasLiked ? 'unliking' : 'liking'} post`);
    }
  };

  const handleComment = async (postId) => {
    if (!newComment[postId]) return;

    try {
      await axios.post('https://socialmedia-mern-509c.onrender.com/comment', {
        postId,
        userId,
        comment: newComment[postId],
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, { userId, comment: newComment[postId] }] }
            : post
        )
      );
      setNewComment({ ...newComment, [postId]: '' }); 
    } catch (err) {
      setError('Error adding comment');
    }
  };

  return (
    <div style={{ margin: '16px 0'}}>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {posts.map((post) => {
        const hasLiked = post.likes.includes(userId);

        return (
          <div key={post._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: '#333' }}>{post.userId.username}</h2>
            <p style={{ margin: '0 0 12px', color: '#555' }}>{post.content}</p>

            {/* Like/Unlike Button */}
            <div>
              <button
                onClick={() => handleLikeToggle(post._id, hasLiked)}
                style={{
                  backgroundColor: hasLiked ? '#e53e3e' : '#3182ce',
                  color: 'white',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hasLiked ? '#c53030' : '#2b6cb0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = hasLiked ? '#e53e3e' : '#3182ce')}
              >
                {hasLiked ? 'Unlike' : 'Like'} ({post.likes.length})
              </button>
            </div>

            {/* Comments */}
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: '#333' }}>Comments</h3>
              {post.comments.length > 0 ? (
                post.comments.map((comment, index) => (
                  <p key={index} style={{ margin: '4px 0', color: '#555' }}>
                    <strong style={{ color: '#333' }}>{comment.userId.username}:</strong> {comment.comment}
                  </p>
                ))
              ) : (
                <p style={{ color: '#777' }}>No comments yet.</p>
              )}

              <div style={{ display: 'flex', marginTop: '8px' }}>
                <input
                  type="text"
                  value={newComment[post._id] || ''}
                  onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
                  placeholder="Add a comment..."
                  style={{flex: 1,border: '1px solid #ccc',padding: '8px',borderRadius: '4px',marginRight: '8px',
                  }}
                />
                <button
                  onClick={() => handleComment(post._id)}
                  style={{backgroundColor: '#3182ce',color: 'white',padding: '8px 12px',border: 'none',borderRadius: '4px',cursor: 'pointer',transition: 'background-color 0.3s',
}}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2b6cb0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
