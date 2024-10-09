import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from './components/Feed';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  const [userId, setUserId] = useState(null); // Store logged-in user ID
  const [username, setUsername] = useState('');

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Login setUserId={setUserId} setUsername={setUsername} />} 
        />
        <Route 
          path="/register" 
          element={<Register setUserId={setUserId} setUsername={setUsername} />} 
        />
        <Route 
          path="/feed" 
          element={<Feed userId={userId} username={username} setUserId={setUserId} setUsername={setUsername} />} 
        />
      </Routes>
    </Router>
  );

};

export default App;
