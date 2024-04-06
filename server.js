const express = require('express');
const app = express();
const path = require('path');
const { getStockQuote } = require('./stockService');

app.listen(8080, function(){
  console.log('listening on 8080');
});

// 정적 파일을 제공하기 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'mycarstock_react/build')));

// Home 화면에 접속하면 index.html을 보여줍니다.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_react/build/index.html'));
});

// 애플(AAPL) 주식 가격을 보여주는 경로를 설정합니다.
app.get('/appleStockPrice', async (req, res) => {
  try {
    const quote = await getStockQuote('AAPL');
    res.send(`Apple Stock Price: $${quote.regularMarketPrice}`);
  } catch (error) {
    res.status(500).send('Error fetching Apple stock price');
  }
});

// 리액트로 라우팅을 할 때, 모든 요청을 index.html로 리다이렉션합니다.
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_react/build/index.html'));
});
