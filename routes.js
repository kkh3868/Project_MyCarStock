const express = require('express');
const router = express.Router();
const { searchStock } = require('./stockService');

// GET /stock/:symbol 경로에 대한 요청을 처리합니다.
router.get('/stock/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const stockData = await searchStock(symbol);
    res.json(stockData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
