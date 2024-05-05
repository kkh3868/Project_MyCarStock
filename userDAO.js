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

module.exports = {
    createLoginInformation,
    findLoginInformationByLoginId
};
