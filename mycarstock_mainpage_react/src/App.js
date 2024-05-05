import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [totalStockValue, setTotalStockValue] = useState("0.00");
  const [stockSymbol, setStockSymbol] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
                searchResults.map((result, index) => (
                  <li key={index}>
                    {result.symbol} - {result.longname}
                  </li>
                ))
              ) : (
                <li>No results found</li>
              )}
            </ul>
          </div>
        </div>
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
