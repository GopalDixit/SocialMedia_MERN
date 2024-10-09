// FriendRequest.jsx
import React, { useState } from 'react';

const FriendRequest = ({ onClose, onSendRequest }) => {
  const [toUsername, setToUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendRequest(toUsername);
    onClose(); // Close the modal after sending the request
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl mb-4">Send Friend Request</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-gray-700">Username:</label>
          <input
            type="text"
            value={toUsername}
            onChange={(e) => setToUsername(e.target.value)}
            className="border border-gray-300 p-2 w-full mb-4 rounded"
            placeholder="Enter username"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-4 bg-gray-500 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FriendRequest;
