import React, {useState, useEffect } from 'react';
import './App.css';
import stockDriveLogo from './stockDrive.gif';
import axios from 'axios';
function App() {
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // isLoggedIn 상태 추가
  const [memberId, setMemberId] = useState(''); // memberId 상태 추가

  useEffect(() => {
    const storedLoggedInStatus = localStorage.getItem('isLoggedIn');
    const storedMemberId = localStorage.getItem('memberId');
    
    if (storedLoggedInStatus === 'true') {
      setIsLoggedIn(true);
    }

    if (storedMemberId) {
      setMemberId(storedMemberId);
      window.location.href = '/main';
    }
  }, []);

  const handleLogin = () => {
    axios.post('/', {loginId, loginPassword})
      .then(response => {
        if (response.data.success){
          const memberId = response.data.memberId;
          localStorage.setItem('memberId', memberId);
          localStorage.setItem('isLoggedIn', 'true'); // 로그인 성공 시 isLoggedIn을 true로 설정
          setMessage('로그인 성공!');
          window.location.href = '/main';
        } else {
          setMessage('아이디 또는 비밀번호가 잘못되었습니다.');
        }
      })
      .catch(error => {
        console.error('로그인 오류: ', error);
      });
  };

  return (
    <div className="App">
      {/* Header */}
      <img src={stockDriveLogo} alt="StockDrive Logo" className="logo" />
      <div className="blue-header">
        <h1>StockDrive</h1>
      </div>

      {/* Login Interface */}
      <div className="login-container">
        <h2>Login</h2>
        <div className="input-container">
          <input type="text" placeholder="ID" className="login-input" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
          <input type="password" placeholder="Password" className="login-input" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        </div>
        <div className="button-container">
          <button className="login-button" onClick={handleLogin}>Login</button>
        </div>
        <div className="link-container">
          <span className="create-id">Create ID</span>
          <span className="find-id">Find ID</span>
          <span className="forgot-password">Forgot Password?</span>
        </div>
      </div>

      {/* 홈페이지 구성의 끝 */}
    </div>
  );
}

export default App;
