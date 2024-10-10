import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUserId, setUsername }) => {
  const [username, setLoginUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4800/login', {
        username,
        password,
      });

      // Correctly store the token from the response
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('username', response.data.username);
      console.log('token is', response.data.token);

      if (response.data && response.data._id && response.data.username && response.data.token) {
        setUserId(response.data._id); 
        setUsername(response.data.username); 
        navigate('/feed'); // Navigate to feed on successful login
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7f9fc', fontFamily: 'Arial, sans-serif'}}>
      <div style={{backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '300px', textAlign: 'center'}}>
        <h2 style={{marginBottom: '20px', color: '#333'}}>Login</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setLoginUsername(e.target.value)}
            required
            style={{width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', outline: 'none', fontSize: '16px', transition: 'border-color 0.3s'}}
            onFocus={(e) => (e.target.style.borderColor = '#007bff')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', outline: 'none', fontSize: '16px', transition: 'border-color 0.3s'}}
            onFocus={(e) => (e.target.style.borderColor = '#007bff')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          <button
            type="submit"
            style={{width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#ffffff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s'}}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
          >
            Login
          </button>
        </form>
        <p style={{marginTop: '15px', color: '#555'}}>
          Don't have an account? <a href="/register" style={{color: '#007bff', textDecoration: 'none'}}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
