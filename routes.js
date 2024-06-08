const express = require('express');
const router = express.Router();
const path = require('path');
const { getStockQuote, getStockSymbol } = require('./stockService');
const userDAO = require('./userDAO');

// 전역으로 연결 객체 생성
let conn;

// 서버 시작 시 연결 생성
(async () => {
  try {
    conn = await userDAO.createConnection();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
})();

const homeRouter = (req, res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_react/build/index.html'));
};

const mainRouter = (req, res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_mainpage_react/build/index.html'));
};

const handleLoginRequest = async (req, res) => {
  const { loginId, loginPassword } = req.body;
  try {
    const user = await userDAO.findLoginInformationByLoginId(loginId, conn);
    if (user && user.login_password === loginPassword) {
      res.json({success:true, memberId : user.member_id});
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

const AddStock = async (req, res) => {
  const { memberId, symbol, quantity } = req.body;
  try {
    // 주식 정보를 업데이트하고 갱신된 주식 정보를 받아옴
    const stockInformation = await userDAO.AddStockQuoteQuantityInformation(memberId, symbol, quantity, conn);

    // 총 주식 가치를 계산
    let totalValue = 0;
    const symbols = [];
    const quantities = [];
    const totalValuePerStocks = [];

    for (const stock of stockInformation) {
      // 주식 가격 정보를 가져옴
      const quote = parseFloat(await getStockQuote(stock.symbol));
    
      // 주식별 총 가치 계산
      const totalValuePerStock = (quote * stock.quantity).toFixed(2);
    
      // 주식별 총 가치를 totalValue에 누적
      totalValue += parseFloat(totalValuePerStock);
      
      // 총 가치 및 주식 정보 배열에 추가
      symbols.push(stock.symbol);
      quantities.push(stock.quantity);
      totalValuePerStocks.push(totalValuePerStock);
      console.log(`totalValue : ${totalValue}`);
    }

    // 응답 데이터 형식 설정
    const data = {
      symbols: symbols,
      quantities: quantities,
      totalValuePerStocks: totalValuePerStocks,
      totalValue: totalValue
    };

    // 클라이언트에 응답 전송
    res.json(data);
  } catch (error) {
    // 오류 처리
    console.error('주식 정보를 가져오는 중 오류 발생:', error);
    res.status(500).send('서버 오류');
  }
};


const DeleteStock = async (req,res) => {

}

const GetMemberInfo = async (req, res) => {
  const memberId = req.headers['x-member-id'];
  let totalValue = 0;
  try {
    console.log(`memberId : ${memberId}`);
    const stockInformation = await userDAO.GetAllStocksInformation(memberId, conn);
    const symbols = [];
    const quantities = [];
    const totalValuePerStocks = [];
    
    for (const stock of stockInformation) {
      console.log(`Symbol: ${stock.symbol}, Quantity: ${stock.quantity}`);
      const quote = parseFloat(await getStockQuote(stock.symbol));
      console.log(`quote: ${quote}`);
      const totalValuePerStock = (quote * stock.quantity).toFixed(2);

      totalValue += parseFloat(totalValuePerStock); // 각 주식의 가치를 누적

      symbols.push(stock.symbol);
      quantities.push(stock.quantity);
      totalValuePerStocks.push(totalValuePerStock);
    }

    const data = {
      symbols: symbols,
      quantities: quantities,
      totalValuePerStocks: totalValuePerStocks,
      totalValue: totalValue.toFixed(2) // 총 주식 가치를 소수점 둘째 자리까지 고정
    };

    res.json(data);
  } catch (error) {
    console.error('주식 정보를 가져오는 중 오류 발생:', error);
    res.status(500).send('서버 오류');
  }
}


module.exports = {
  router,
  homeRouter,
  mainRouter,
  handleLoginRequest,
  handleStockSearch,
  AddStock,
  DeleteStock,
  GetMemberInfo,
};
