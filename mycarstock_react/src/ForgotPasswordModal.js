import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [id, setId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    axios.post('/forgot-password', { id, newPassword })
      .then(response => {
        if (response.data.success) {
          setMessage('비밀번호 변경 성공!');
          onClose();
        } else {
          setMessage('비밀번호 변경 실패!');
        }
      })
      .catch(error => {
        console.error('비밀번호 변경 오류: ', error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Forgot Password</h2>
        <input type="text" placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} />
        <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleForgotPassword}>Submit</button>
        <button onClick={onClose}>Close</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
