import React, { useState } from 'react';
import axios from 'axios';

const CreateIdModal = ({ isOpen, onClose }) => {
  const [newId, setNewId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateId = () => {
    axios.post('/create-id', { newId, newPassword, email })
      .then(response => {
        if (response.data.success) {
          setMessage('ID 생성 성공!');
          onClose();
        } else {
          setMessage('ID 생성 실패!');
        }
      })
      .catch(error => {
        console.error('ID 생성 오류: ', error);
      });
  };
  
  // isOpen == false : Modal 닫기
  // isOpen == true : Modal 열기
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create ID</h2>
        <input type="text" placeholder="New ID" value={newId} onChange={(e) => setNewId(e.target.value)} />
        <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleCreateId}>Create</button>
        <button onClick={onClose}>Close</button>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default CreateIdModal;
