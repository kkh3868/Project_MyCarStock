const express = require('express');
const router = express.Router();
const { getStockQuote } = require('./stockService');

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


// 리액트로 라우팅을 할 때 모든 요청을 index.html로 리다이렉션하는 핸들러
const reactRouter = (req, res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_react/build/index.html'));
};

module.exports = {
  router,
  getAppleStockPrice,
  reactRouter
};
