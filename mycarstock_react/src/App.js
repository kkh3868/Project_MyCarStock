import React, { useState, useEffect } from 'react';
import './App.css';
import stockDriveLogo from './stockDrive.gif';
import axios from 'axios';
import CreateIdModal from './CreateIdModal';
import FindIdModal from './FindIdModal';
import ForgotPasswordModal from './ForgotPasswordModal';

function App() {
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isCreateIdModalOpen, setIsCreateIdModalOpen] = useState(false);
  const [isFindIdModalOpen, setIsFindIdModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  useEffect(() => {
    const storedMemberId = localStorage.getItem('memberId');

    if (storedMemberId) {
      window.location.href = '/main';
    }
  }, []);

  const handleLogin = () => {
    axios.post('/', { loginId, loginPassword })
      .then(response => {
        if (response.data.success) {
          const memberId = response.data.memberId;
          localStorage.setItem('memberId', memberId);
          localStorage.setItem('isLoggedIn', 'true');
          window.location.href = '/main';
        } else {
          //setMessage('아이디 또는 비밀번호가 잘못되었습니다.');
        }
      })
      .catch(error => {
        console.error('로그인 오류: ', error);
      });
  };

  return (
    <div className="App">
      <img src={stockDriveLogo} alt="StockDrive Logo" className="logo" />
      <div className="blue-header">
        <h1>StockDrive</h1>
      </div>

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
          <span className="create-id" onClick={() => setIsCreateIdModalOpen(true)}>Create ID</span>
          <span className="find-id" onClick={() => setIsFindIdModalOpen(true)}>Find ID</span>
          <span className="forgot-password" onClick={() => setIsForgotPasswordModalOpen(true)}>Forgot Password?</span>
        </div>
      </div>

      <CreateIdModal isOpen={isCreateIdModalOpen} onClose={() => setIsCreateIdModalOpen(false)} />
      <FindIdModal isOpen={isFindIdModalOpen} onClose={() => setIsFindIdModalOpen(false)} />
      <ForgotPasswordModal isOpen={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)} />
    </div>
  );
}

export default App;
