import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function Modal({ selectedItem, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = async () => {
    await onAdd(quantity);
    onClose();
  };

  return (
    <div className="modal-sheet">
      <div className="modal-content">
        <h2>Add Item</h2>
        <p>You selected: {selectedItem.symbol} - {selectedItem.longname}</p>
        <label>Quantity: <input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} /></label>
        <div className="modal-buttons">
          <button onClick={handleAdd}>Add</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}


function App() {

  const [totalStockValue, setTotalStockValue] = useState("0.00");
  const [stockSymbol, setStockSymbol] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberId, setmemberId] = useState('');

  useEffect(() => {
    // localStorage에서 memberId 값 가져오기
    const storedMemberId = localStorage.getItem('memberId');
    if (storedMemberId) {
      setmemberId(storedMemberId);
    }
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 설정

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setStockSymbol(query);
  
    try {
      const response = await axios.post('/main', { query });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error fetching search results : ', error);
    }
  };

  const handleItemClick = (result) => {
    setSelectedItem(result);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = async (quantity) => {
    // 여기서 선택된 아이템과 수량을 사용하여 필요한 작업을 수행합니다.
    const response = await axios.put('/main/:stockInfo', { memberId : memberId, symbol : selectedItem.symbol, quantity : quantity });
  };

  return (
    <div className="App">
    {/* Header*/}
    <header className='blue-header'>
      <h1>StockDrive</h1>
    </header>

    {/* Main */}
    <main className='main-container'>
      {/* Left Section*/}
      <section className='left-section'>
        <div class="search-box">
          <input type="text" placeholder="Search..." value={stockSymbol} onChange={handleInputChange}/>
          <img src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png" />
          <div className='search-results'>
            <ul>
              {searchResults && searchResults.length > 0 ? (
                searchResults.slice(0, 3).map((result, index) => ( // 최대 3개의 결과만 표시
                  <li key={index} onClick={() => handleItemClick(result)}>
                    {result.symbol} - {result.longname}
                  </li>
                ))
              ) : (
                <li>No results found</li>
              )}
            </ul>
          </div>
        </div>
        {isModalOpen && (
        <Modal selectedItem={selectedItem} onClose={handleCloseModal} onAdd={handleAddToCart} />
        )}
        <div className='graph-container'>

        </div>
      </section>
      {/* Right Section*/}
      <section className='right-section'>
      <div className='table-container'>
        <div className='stock-value-section'>
          <h2 style={{ color: "White" }}>Total Value of Current Stocks</h2>
          <h2 style={{ fontSize: "2.5rem" }}>$ {totalStockValue}</h2>
        </div>
        <div className='stock-table-section'>
          <table>
            <thead>
              <tr>
                <th>Index</th>
                <th>Stock Name</th>
                <th>Quantity</th>
                <th>Total Stock Quote</th>
                <th>Stock Quote</th>
              </tr>
            </thead>
            <tbody>
              {/* 첫 번째 행 */}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {/* 두 번째 행 */}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {/* 세 번째 행 */}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              {/* 네 번째 행 */}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      </section>

    </main>


    </div>
  );
}

export default App;
