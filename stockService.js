const yahooFinance = require('yahoo-finance2').default;

async function getStockQuote(symbol) {
  try {
    const quote = await yahooFinance.quote(symbol);
    return quote;
  } catch (error) {
    throw new Error('Error fetching stock quote');
  }
}

async function getStockSymbol(query){
  try{
    const result = await yahooFinance.search(query);
    return result;
  } catch (error) {
    throw new Error('Error fetching stock symbol');
  }
}

module.exports = { 
  getStockQuote,
  getStockSymbol,
};