import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Username:', username);
    console.log('Password:', password);
    setUsername('');
    setPassword('');
  };

  return (
    <div className='login-container'>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div className='input-group'>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className='input-group'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button className='submit-btn' type="submit">Đăng nhập</button>
      </form>
      <div className='link-register'>
        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
      </div>
    </div>
  );
};

export default LoginPage;