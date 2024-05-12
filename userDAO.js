const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'stockdriveuser',
    password: '9409',
    database: 'stockdrive',
});

conn.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ', err);
        return;
    }
    console.log('Connected to Database');
});

function createLoginInformation(loginId, loginPassword){
    const query = 'INSERT INTO login_information (login_id, login_password) VALUES (?, ?)';
    const values = [loginId, loginPassword];

    return new Promise((resolve, reject) => {
        conn.query(query, values, (err, result) =>{
            if(err){
                console.error('Error creating login information: ', err);
                reject(err);
                return;
            }
            console.log('Login information created successfully');
            resolve(result);
        });
    });
}

function findLoginInformationByLoginId(loginId) {
    const query = 'SELECT * FROM login_information WHERE login_id = ?';
    const value = [loginId];

    return new Promise((resolve, reject) => {
        conn.query(query, value, (err, rows) => {
            if (err) {
                console.error('Error finding login information by member id: ', err);
                reject(err);
                return;
            }
            resolve(rows[0]);
        });
    });
}

function AddStockQuoteQuantityInformation(memberId, symbol, quantityToAdd){
    const findMemberQuery = 'SELECT * FROM login_information WHERE member_id = ?';
    const findMemberValue = [memberId];

    const findStockQuery = 'SELECT * FROM stock_ownership WHERE member_id = ? AND symbol = ?';
    const findStockValues = [memberId, symbol];

    const insertStockQuery = 'INSERT INTO stock_ownership (member_id, symbol, quantity) VALUES (?, ?, ?)';
    const insertStockValues = [memberId, symbol, quantityToAdd];

    const updateStockQuery = 'UPDATE stock_ownership SET quantity = ? WHERE member_id = ? AND symbol = ?';
    
    return new Promise((resolve, reject) => {
        // 회원 ID에 해당하는 행 찾기
        conn.query(findMemberQuery, findMemberValue, (err, rows) => {
            if (err) {
                console.error('Error finding member: ', err);
                reject(err);
                return;
            }
            
            if (rows.length === 0) {
                console.error('Member not found');
                reject(new Error('Member not found'));
                return;
            }
            
            // 주식 보유 정보 확인
            conn.query(findStockQuery, findStockValues, (err, stockRows) => {
                if (err) {
                    console.error('Error finding stock: ', err);
                    reject(err);
                    return;
                }
                
                if (stockRows.length === 0) {
                    // 해당 주식이 없으면 새로운 레코드 삽입
                    conn.query(insertStockQuery, insertStockValues, (err, result) => {
                        if (err) {
                            console.error('Error adding stock quote quantity information: ', err);
                            reject(err);
                            return;
                        }
                        console.log('Stock quote quantity information added successfully');
                        resolve(result);
                    });
                } else {
                    // 해당 주식이 있으면 수량 업데이트
                    const currentQuantity = stockRows[0].quantity;
                    const newQuantity = currentQuantity + quantityToAdd;
                    conn.query(updateStockQuery, [newQuantity, memberId, symbol], (err, result) => {
                        if (err) {
                            console.error('Error updating stock quote quantity information: ', err);
                            reject(err);
                            return;
                        }
                        console.log('Stock quote quantity information updated successfully');
                        resolve(result);
                    });
                }
            });
        });
    });
}

module.exports = {
    createLoginInformation,
    findLoginInformationByLoginId,
    AddStockQuoteQuantityInformation,
};
