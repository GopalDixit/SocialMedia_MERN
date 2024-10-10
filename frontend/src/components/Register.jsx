import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4800/register', {
        username,
        email,
        password,
        fullName,
      });
      navigate('/'); 
    } catch (err) {
      setError(err.response.data.message || 'Registration failed');
    }
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7f9fc', fontFamily: 'Arial, sans-serif'}}>
      <div style={{backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', width: '300px', textAlign: 'center'}}>
        <h2 style={{marginBottom: '20px', color: '#333'}}>Register</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc', outline: 'none', fontSize: '16px', transition: 'border-color 0.3s'}}
            onFocus={(e) => (e.target.style.borderColor = '#007bff')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            Register
          </button>
        </form>
        <p style={{marginTop: '15px', color: '#555'}}>
          Already have an account? <a href="/" style={{color: '#007bff', textDecoration: 'none'}}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
