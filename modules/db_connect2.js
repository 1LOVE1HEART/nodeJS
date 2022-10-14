const mysql = require('mysql2');


// 連線池
const pool = mysql.createPool({
    host: process.env.DB_HOST ||'localhost',
    user: process.env.DB_USER ||'root',
    password: process.env.DB__PASS ||'root',
    database: process.env.DB_NAME ||'project57',
    waitForConnections: true, // 當連接池沒有連接或超出最大限制時，設置為true且會把連接放入隊列，設置為false會返回error. 
    connectionLimit: 10, // 最大連線數
    queueLimit: 0, // 限制排隊數 0代表無限制
});

module.exports = pool.promise();