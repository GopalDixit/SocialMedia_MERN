import React, { useState, useEffect } from 'react';

const FriendRequestView = ({ userId }) => {
  const [friendRequestView, setFriendRequestView] = useState([]); // Fixed variable naming
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log('id in view', userId);

  useEffect(() => {
    const fetchFriendRequestView = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4800/get-friend-requests/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setFriendRequestView(data.friendRequests || []); // Changed to friendRequests
        } else {
          setError(data.message || 'Failed to load friend requests.');
        }
      } catch (err) {
        setError('Failed to load friend requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequestView();
  }, [userId]);

  const handleRespondRequest = async (fromUserId, status) => {
    try {
      const response = await fetch('http://localhost:4800/respond-friend-request', {
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
        setFriendRequestView(friendRequestView.filter(req => req.fromUser._id !== fromUserId)); // Fixed fromUser check
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
            {request.fromUser.username} {/* Ensure you send the username in the response */}
            <button
              onClick={() => handleRespondRequest(request.fromUser._id, 'accepted')}
              className="bg-green-500 text-white py-2 px-4 ml-2 rounded"
            >
              Accept
            </button>
            <button
              onClick={() => handleRespondRequest(request.fromUser._id, 'rejected')}
              className="bg-red-500 text-white py-2 px-4 ml-2 rounded"
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
