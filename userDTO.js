const mysql = require('mysql2/promise');

class UserDTO {
    constructor(member_id, login_id, login_password){
        this.member_id = member_id;
        this.login_id = login_id;
        this.login_password = login_password;
    }
}

module.exports = UserDTO;