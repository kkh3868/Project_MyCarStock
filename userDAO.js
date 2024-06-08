const mysql = require('mysql2/promise');

async function createConnection() {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'stockdriveuser',
            password: '9409',
            database: 'stockdrive',
        });
        console.log('Connected to MySQL database');
        return conn;
    } catch (err) {
        console.error('Error connecting to MySQL database: ', err);
        throw err;
    }
}

async function createLoginInformation(loginId, loginPassword, conn) {
    try {
        const query = 'INSERT INTO login_information (login_id, login_password) VALUES (?, ?)';
        const values = [loginId, loginPassword];
        const [result] = await conn.execute(query, values);
        console.log('Login information created successfully');
        return result;
    } catch (err) {
        console.error('Error creating login information: ', err);
        throw err;
    }
}

async function findLoginInformationByLoginId(loginId, conn) {
    try {
        const query = 'SELECT * FROM login_information WHERE login_id = ?';
        const value = [loginId];
        const [rows] = await conn.execute(query, value);
        return rows[0];
    } catch (err) {
        console.error('Error finding login information by login id: ', err);
        throw err;
    }
}

async function AddStockQuoteQuantityInformation(memberId, symbol, quantityToAdd, conn) {
    try {
        const findStockQuery = 'SELECT * FROM stock_ownership WHERE member_id = ? AND symbol = ?';
        const findStockValues = [memberId, symbol];
        const insertStockQuery = 'INSERT INTO stock_ownership (member_id, symbol, quantity) VALUES (?, ?, ?)';
        const insertStockValues = [memberId, symbol, quantityToAdd];
        const updateStockQuery = 'UPDATE stock_ownership SET quantity = ? WHERE member_id = ? AND symbol = ?';

        const [memberRows] = await conn.execute('SELECT * FROM login_information WHERE member_id = ?', [memberId]);
        if (memberRows.length === 0) {
            console.error('Member not found');
            throw new Error('Member not found');
        }

        const [stockRows] = await conn.execute(findStockQuery, findStockValues);
        if (stockRows.length === 0) {
            // 해당 주식이 없으면 새로운 레코드 삽입
            await conn.execute(insertStockQuery, insertStockValues);
            console.log('Stock quote quantity information added successfully');
        } else {
            // 해당 주식이 있으면 수량 업데이트
            const currentQuantity = stockRows[0].quantity;
            const newQuantity = currentQuantity + quantityToAdd;
            await conn.execute(updateStockQuery, [newQuantity, memberId, symbol]);
            console.log('Stock quote quantity information updated successfully');
        }

        // 모든 주식 정보 갱신
        const stockInformation = await GetAllStocksInformation(memberId, conn);
        return stockInformation;
    } catch (err) {
        console.error('Error adding/updating stock quote quantity information: ', err);
        throw err;
    }
}

async function GetAllStocksInformation(memberId, conn) {
    try {
        const findSymbolQuantityQuery = 'SELECT symbol, quantity FROM stock_ownership WHERE member_id = ?';
        const [results] = await conn.execute(findSymbolQuantityQuery, [memberId]);
        return results.map(result => ({
            symbol: result.symbol,
            quantity: result.quantity
        }));
    } catch (err) {
        console.error('Error fetching stock ownership information: ', err);
        throw err;
    }
}

module.exports = {
    createConnection,
    createLoginInformation,
    findLoginInformationByLoginId,
    AddStockQuoteQuantityInformation,
    GetAllStocksInformation,
};
