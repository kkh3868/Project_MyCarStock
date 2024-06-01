import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import './footer.css'; 
import './table.css';
import './searchbox.css';
import './modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faBlog, faN } from '@fortawesome/free-solid-svg-icons';


function Modal({ selectedItem, onClose, onAdd, onClear }) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = async () => {
    await onAdd(quantity);
    onClose();
    onClear();
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
  const curveRef = useRef(null);

  const [totalStockValue, setTotalStockValue] = useState("0.00");
  const [stockSymbol, setStockSymbol] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberId, setMemberId] = useState('');

  useEffect(() => {
    let lastKnownScrollPosition = 0;
    const defaultCurveValue = 350;
    const curveRate = 3;
    let ticking = false;
    let curveValue;

    // localStorage에서 memberId 값 가져오기
    const storedMemberId = localStorage.getItem('memberId');
    if (storedMemberId) {
      setMemberId(storedMemberId);
    }

    // Handle the functionality
    function scrollEvent(scrollPos) {
      if (scrollPos >= 0 && scrollPos < defaultCurveValue) {
        curveValue = defaultCurveValue - parseFloat(scrollPos / curveRate);
        if (curveRef.current) {
          curveRef.current.setAttribute(
            "d",
            `M 800 300 Q 400 ${curveValue} 0 300 L 0 0 L 800 0 L 800 300 Z`
          );
        }
      }
    }

    // Scroll Listener
    function handleScroll() {
      lastKnownScrollPosition = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          scrollEvent(lastKnownScrollPosition);
          ticking = false;
        });
      }

      ticking = true;
    }

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  const handleClearResults = () => {
    setSearchResults([]);
  }
  const handleAddToCart = async (quantity) => {
    // 여기서 선택된 아이템과 수량을 사용하여 필요한 작업을 수행합니다.
    const response = await axios.put('/main/:stockInfo', { memberId : memberId, symbol : selectedItem.symbol, quantity : quantity });
  };

  const handleLogout = () => {
    localStorage.removeItem('memberId');
    localStorage.setItem('isLoggedIn', 'false');
    setMemberId('');
    window.location.href = '/';
  };

  return (
    <div>

      <div className="svg-container">
        <svg viewBox="0 0 800 400" className="svg">
          <path
            ref={curveRef}
            id="curve"
            fill="#50c6d8"
            d="M 800 300 Q 400 350 0 300 L 0 0 L 800 0 L 800 300 Z"
          />
        </svg>
      </div>
      <header>
          <h1>StockDrive</h1>
          <h4>Check out the cars you can buy with your stock!!</h4>
          <br/>
          <button onClick={handleLogout} className="btn btn-white btn-animated">Log Out</button>
      </header>

      <main>
        <div className='main-container'>
          <div className='image-container'>
            <h1>- IG Grandeur -</h1>
            <br></br>
            <h2>10,000$ ~ 20,000$</h2>
            <img
              src="https://lh6.googleusercontent.com/proxy/US4sAwGxoKVWSo_2K-mXJeFd1OMnxHvRuHaQ9dv31Mhp-7ZuLcyB18nI-F6o6Wd2Klq9Fejq2NXerQMUQwhJbz1PLY32TmQwR_jKHik_o2-diA"
              alt="Example Image"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>

          <div className='table-container'>
            <h1>- Total Value of Current Stocks -</h1>
            <br></br>
            <h2>$ 20,000</h2>
            <br/>
            <div className='search'>
              <form className='search-form'>
                <input type='text' placeholder='Search for your stock...' value={stockSymbol} onChange={handleInputChange}/>
                <input type='submit' value="Submit" />
                <div className='search-results' style={{display: searchResults.length>0 && !isModalOpen ? 'block' : 'none' }}>
                  <ul>
                    {searchResults && searchResults.length > 0 ? (
                      searchResults.slice(0,3).map((result, index) => (
                        <li key={index} onClick={()=> handleItemClick(result)}>
                          {result.symbol} - {result.longname}
                        </li>
                      ))
                    ) : (
                      <li>No results found</li>
                    )}
                  </ul>
                </div>
                {isModalOpen && (
                  <Modal selectedItem={selectedItem} onClose={handleCloseModal} onAdd={handleAddToCart} onClear={handleClearResults}/>
                )}
              </form>
            </div>
            <br></br>

            <table className='rwd-table'>
              <tbody>
                <tr>
                  <th>Index</th>
                  <th>Stock Name</th>
                  <th>Quantity</th>
                  <th>Total Stock Quote</th>
                  <th>Stock Quote</th>
                </tr>
                <tr>
                  <td data-th="Index">1</td>
                  <td data-th="Stock Name">AAPL</td>
                  <td data-th="Quantity">25</td>
                  <td data-th="Total Stock Quote">5000</td>
                  <td data-th="Stock Quote">200</td>
                </tr>
                <tr>
                  <td data-th="Index">2</td>
                  <td data-th="Stock Name">NVDA</td>
                  <td data-th="Quantity">5</td>
                  <td data-th="Total Stock Quote">5000</td>
                  <td data-th="Stock Quote">1000</td>
                </tr>
                <tr>
                  <td data-th="Index">3</td>
                  <td data-th="Stock Name">SOXL</td>
                  <td data-th="Quantity">100</td>
                  <td data-th="Total Stock Quote">5000</td>
                  <td data-th="Stock Quote">50</td>
                </tr>
                <tr>
                  <td data-th="Index">4</td>
                  <td data-th="Stock Name">IBIT</td>
                  <td data-th="Quantity">125</td>
                  <td data-th="Total Stock Quote">5000</td>
                  <td data-th="Stock Quote">40</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="new_footer_area bg_color">
        <div className="new_footer_top">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="f_widget social-widget pl_70 wow fadeInLeft" data-wow-delay="0.8s">
                  <h3 className="f-title f_600 t_color f_size_18">Please Visit</h3>
                  <div className="f_social_icon">
                    <a href="https://blog.naver.com/codingfarm"><FontAwesomeIcon icon={faBlog} /></a>
                    <a href="https://kkh3868.notion.site/Portfolio-59debe89a94d4552b1c5363b16657adb"><FontAwesomeIcon icon={faN} /></a>
                    <a href="https://www.linkedin.com/in/geonhuikim1998/" className="fab fa-linkedin"><FontAwesomeIcon icon={faLinkedin} /></a>
                    <a href="https://github.com/kkh3868" className="fab fa-github"><FontAwesomeIcon icon={faGithub} /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer_bg">
            <div className="footer_bg_one"></div>
            <div className="footer_bg_two"></div>
          </div>
        </div>
        <div className="footer_bottom">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-sm-7">
                <p>
                  <span>Producer : CodingFarm</span><br />
                  <span>Email : rjsgml198@gmail.com</span><br />
                  <span>© Copyright 2024. CodingFarm, All Rights Reserved.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
