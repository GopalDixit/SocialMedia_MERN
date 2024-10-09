import React, { useState, useEffect } from 'react';
import PostList from './PostLists';
import FriendRequestView from './FriendRequestView'; 
import PostContent from './PostContent';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Feed = ({ userId, username, setUserId, setUsername }) => {
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPostPopup, setShowPostPopup] = useState(false); // New state for posting content
  const [toUsername, setToUsername] = useState('');
  const [postContent, setPostContent] = useState(''); // State for post content
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError('User ID not found. Please login again.');
    }
  }, [userId]);

  const handleLogout = () => {
    setUserId('');
    setUsername('');
    navigate('/');
  };

  const handleSendRequest = async () => {
    try {
      const response = await fetch('http://localhost:4800/friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromUserId: userId,
          toUsername: toUsername,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Friend request sent successfully!');
        setShowPopup(false);
      } else {
        alert(data.message || 'Failed to send friend request.');
      }
    } catch (error) {
      alert('An error occurred while sending the friend request.');
    }
  };

  // Function to handle posting content
  const handlePostContent = async () => {
    try {
      const response = await fetch('http://localhost:4800/post-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          content: postContent,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Post content submitted successfully!');
        setPostContent(''); // Clear input field
        setShowPostPopup(false); // Close modal
      } else {
        alert(data.message || 'Failed to post content.');
      }
    } catch (error) {
      alert('An error occurred while posting content.');
    }
  };

  return (
    <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#2d3748', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold' }}>Welcome, {username}</h1>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={handleLogout}
            style={{ backgroundColor: '#e53e3e', color: 'white', padding: '10px 16px', borderRadius: '4px', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c53030')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e53e3e')}
          >
            Logout
          </button>
          <button
            onClick={() => setShowPopup(true)}
            style={{ backgroundColor: '#3182ce', color: 'white', padding: '10px 16px', borderRadius: '4px', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2b6cb0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
          >
            Send Friend Request
          </button>
          <button
            onClick={() => setShowPostPopup(true)} // Open post content modal
            style={{ backgroundColor: '#38a169', color: 'white', padding: '10px 16px', borderRadius: '4px', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2f855a')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#38a169')}
          >
            Post Content
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '24px auto', padding: '16px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold' }}>{`${username}'s Feed`}</h1>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {!error && <PostList userId={userId} />}

        {/* Friend Requests Component */}
        <FriendRequestView userId={userId} />
      </div>

      {/* Friend Request Modal */}
      <Modal
        isOpen={showPopup}
        onRequestClose={() => setShowPopup(false)}
        contentLabel="Send Friend Request"
        style={{
          content: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            margin: 'auto',
            height:'400px'

          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 'bold', color: '#2d3748' }}>Send Friend Request</h2>
        <label style={{ display: 'block', marginBottom: '8px', color: '#4a5568' }}>Enter Username:</label>
        <input
          type="text"
          value={toUsername}
          onChange={(e) => setToUsername(e.target.value)}
          style={{ border: '1px solid #cbd5e0', padding: '10px', width: '100%', marginBottom: '16px', borderRadius: '4px', outline: 'none', transition: 'border-color 0.3s' }}
          placeholder="Username"
          required
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowPopup(false)}
            style={{ marginRight: '8px', backgroundColor: '#a0aec0', color: 'white', padding: '10px 16px', borderRadius: '4px', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#718096')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#a0aec0')}
          >
            Cancel
          </button>
          <button
            onClick={handleSendRequest}
            style={{ backgroundColor: '#3182ce', color: 'white', padding: '10px 16px', borderRadius: '4px', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2b6cb0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
          >
            Send Request
          </button>
        </div>
      </Modal>

      {/* Post Content Modal */}
      <Modal
        isOpen={showPostPopup}
        onRequestClose={() => setShowPostPopup(false)}
        contentLabel="Post Content"
        style={{
          content: {
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            margin: 'auto',
            height:'400px'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <h2 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: 'bold', color: '#2d3748' }}>Post Content</h2>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          style={{ border: '1px solid #cbd5e0', padding: '10px', width: '100%', height: '100px', marginBottom: '16px', borderRadius: '4px', outline: 'none', transition: 'border-color 0.3s' }}
          placeholder="Write your post here..."
          required
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowPostPopup(false)}
            style={{ marginRight: '8px', backgroundColor: '#a0aec0', color: 'white', padding: '10px 16px', borderRadius: '4px', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#718096')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#a0aec0')}
          >
            Cancel
          </button>
          <button
            onClick={handlePostContent}
            style={{ backgroundColor: '#3182ce', color: 'white', padding: '10px 16px', borderRadius: '4px', transition: 'background-color 0.3s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2b6cb0')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
          >
            Post
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Feed;
