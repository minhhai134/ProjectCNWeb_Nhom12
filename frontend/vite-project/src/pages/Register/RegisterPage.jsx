import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate thay vì useHistory
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [displayAccountName,setDisplayAccountName]= useState('')
  const [password, setPassword] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  //   const data = {
  //     email,
  //     username: displayName,
  //     password,
  //     date_of_birth: `${dobDay}-${dobMonth}-${dobYear}`,
  //   };

  //   const url = 'https://discord.com/api/v10/users/@me';

  //   fetch(url, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Bot ${YOUR_DISCORD_BOT_TOKEN}`,
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => console.log('Success:', data))
  //     .catch((error) => console.error('Error:', error));
  // };
    navigate('/Login');
  };

  return (
    <div className="register-form">
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="displayName">Tên hiển thị:</label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="displayAccountName">Tên đăng nhập:</label>
          <input
            type="text"
            id="displayAccountName"
            value={displayAccountName}
            onChange={(event) => setDisplayAccountName(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div className="dob-inputs">
          <div className="dob-input">
            <label htmlFor="dobDay">Ngày sinh:</label>
            <input
              type="number"
              id="dobDay"
              min="1"
              max="31"
              value={dobDay}
              onChange={(event) => setDobDay(event.target.value)}
            />
          </div>
          <div className="dob-input">
            <label htmlFor="dobMonth">Tháng sinh:</label>
            <input
              type="number"
              id="dobMonth"
              min="1"
              max="12"
              value={dobMonth}
              onChange={(event) => setDobMonth(event.target.value)}
            />
          </div>
          <div className="dob-input">
            <label htmlFor="dobYear">Năm sinh:</label>
            <input
              type="number"
              id="dobYear"
              min="1900"
              max={new Date().getFullYear()}
              value={dobYear}
              onChange={(event) => setDobYear(event.target.value)}
            />
          </div>
        </div>
        <button type="submit">Tiếp tục</button>
      </form>
    </div>
  );
}

export default Register;