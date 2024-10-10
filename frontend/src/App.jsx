import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Feed from './components/Feed';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute'; 

const App = () => {
  const [userId, setUserId] = useState(null); 
  const [username, setUsername] = useState('');

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<ProtectedRoute element={<Login setUserId={setUserId} setUsername={setUsername} />} authRoute={true} />} 
        />
        <Route 
          path="/register" 
          element={<ProtectedRoute element={<Register setUserId={setUserId} setUsername={setUsername} />} authRoute={true} />} 
        />

        <Route 
          path="/feed" 
          element={<ProtectedRoute element={<Feed userId={userId} username={username} setUserId={setUserId} setUsername={setUsername} />} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
