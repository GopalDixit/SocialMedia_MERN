// Navbar.jsx
import React from 'react';

const Navbar = ({ onLogout, onSendRequest }) => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-xl">Your App</h1>
        <div>
          <button
            onClick={onSendRequest}
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
          >
            Send Friend Request
          </button>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
