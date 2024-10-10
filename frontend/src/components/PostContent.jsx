import React, { useState, useEffect } from 'react';

const PostContent = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError('User not logged in.');
    }
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Content cannot be empty.');
      return;
    }

    if (!userId) {
      setError('User not logged in.');
      return;
    }

    try {
      const response = await fetch('https://socialmedia-mern-509c.onrender.com/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          content,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Post created successfully!');
        setContent(''); 
        setError(''); 
      } else {
        setError(data.message || 'Failed to create post.');
        setSuccess(''); 
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setError('An error occurred while creating the post.');
      setSuccess(''); 
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '16px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '24px', color: '#333' }}>Create a New Post</h2>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '12px',
            resize: 'none',
            fontSize: '16px',
            color: '#333',
            backgroundColor: '#fff',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2b6cb0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
        >
          Post
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '12px' }}>{success}</p>}
    </div>
  );
};

export default PostContent;
