// stockService.js

const yahooFinance = require('yahoo-finance2').default;

// 특정 주식의 시세를 가져오는 함수를 정의합니다.
async function getStockQuote(symbol) {
  try {
    // Yahoo Finance API를 사용하여 주식의 시세를 가져옵니다.
    const quote = await yahooFinance.quote(symbol);
    return quote;
  } catch (error) {
    // 오류가 발생하면 오류를 던집니다.
    throw new Error('Error fetching stock quote');
  }
}

module.exports = { getStockQuote };
