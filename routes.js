const express = require('express');
const router = express.Router();
const path = require('path');
const { getStockQuote, getStockSymbol } = require('./stockService');
const userDAO = require('./userDAO');

const getAppleStockPrice = async (req, res) => {
  try {
    const quote = await getStockQuote('AAPL');
    if (!quote) {
      throw new Error('AAPL에 대한 주식 시세를 찾을 수 없습니다.');
    }
    res.send(`애플 주식 가격: $${quote.regularMarketPrice}`);
  } catch (error) {
    console.error('애플 주식 가격을 가져오는 중 오류 발생:', error);
    res.status(500).send('애플 주식 가격을 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
  }
};

const homeRouter = (req, res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_react/build/index.html'));
};

const mainRouter = (req, res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_mainpage_react/build/index.html'));
};

const handleLoginRequest = async (req, res) => {
  const { loginId, loginPassword } = req.body;
  try {
    const user = await userDAO.findLoginInformationByLoginId(loginId);
    if (user && user.login_password === loginPassword) {
      res.json({success:true})
      console.log('Login success');
    } else {
      res.json({success:false})
      console.log('Login failed');
    }
  } catch (error) {
    console.error('로그인 오류: ', error);
    res.status(500).json({ success: false, message: '로그인 중 오류가 발생했습니다.' });
  }
};

const handleStockSearch = async (req, res) => {
  const {query} = req.body;
  try {
    const searchResults = await getStockSymbol(query);
    console.log(searchResults.quotes)
    res.json({success: true, results: searchResults.quotes});
  } catch (error){
    console.error('주식 검색 중 오류 발생 : ', error);
    res.status(500).json({success: false, message: '주식 검색 중 오류가 발생했습니다.'})
  }
}

module.exports = {
  router,
  getAppleStockPrice,
  homeRouter,
  mainRouter,
  handleLoginRequest,
  handleStockSearch,
};
