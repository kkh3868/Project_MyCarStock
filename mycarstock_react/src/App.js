import React from 'react';
import './App.css';
import stockDriveLogo from './stockDrive.gif';

function App() {
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
          <input type="text" placeholder="ID" className="login-input" />
          <input type="password" placeholder="Password" className="login-input" />
        </div>
        <div className="button-container">
          <button className="login-button">Login</button>
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
