import React, { useState, useEffect } from 'react';

const FriendRequestView = () => {
  const [friendRequestView, setFriendRequestView] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Fetch userId from localStorage

  useEffect(() => {
    const fetchFriendRequestView = async () => {
      if (!userId) {
        setError('User ID not found in localStorage.');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`https://socialmedia-mern-509c.onrender.com/get-friend-requests/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setFriendRequestView(data.friendRequests || []);
        } else {
          setError(data.message || 'Failed to load friend requests.');
        }
      } catch (err) {
        console.error('Error fetching friend requests:', err);
        setError('Failed to load friend requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequestView();
  }, [userId]);

  const handleRespondRequest = async (fromUserId, status) => {
    try {
      const response = await fetch('https://socialmedia-mern-509c.onrender.com/respond-friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          fromUserId: fromUserId,
          status: status, // 'accepted' or 'rejected'
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Friend request ${status}!`);
        // Remove the request from the UI
        setFriendRequestView(friendRequestView.filter(req => req.fromUser._id !== fromUserId));
      } else {
        alert(data.message || 'Failed to respond to the friend request.');
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
      alert('An error occurred while responding to the friend request.');
    }
  };

  return (
    <div>
      <h2>Pending Friend Requests</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && friendRequestView.length === 0 && <p>No pending friend requests.</p>}
      
      <ul>
        {friendRequestView.map((request) => (
          <li key={request.fromUser._id}>
            {request.fromUser.username}
            <button
              onClick={() => handleRespondRequest(request.fromUser._id, 'accepted')}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => handleRespondRequest(request.fromUser._id, 'rejected')}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequestView;
