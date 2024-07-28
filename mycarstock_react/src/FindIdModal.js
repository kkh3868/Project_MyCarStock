import React, { useState } from 'react';
import axios from 'axios';
import './FindIdModal.css';

const FindIdModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFindId = () => {
    setFoundId('');
    setErrorMessage('');
    axios.post('/find-id', { email })
      .then(response => {
        if (response.data.success) {
          setFoundId(response.data.id);
        } else {
          setErrorMessage(response.data.message || 'ID 찾기 실패!');
        }
      })
      .catch(error => {
        console.error('ID 찾기 오류: ', error);
        setErrorMessage('오류가 발생했습니다. 다시 시도해 주세요.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>아이디 찾기</h2>
        <p>아이디를 찾으려면 계정 생성 시 작성한 이메일을 작성하세요</p>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        <div className="modal-buttons">
          <button onClick={handleFindId}>Find</button>
          <button onClick={onClose}>Close</button>
        </div>
        {foundId && <p className="result-message">{foundId}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default FindIdModal;
