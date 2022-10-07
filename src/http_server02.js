const http = require('http');
const fs = require('fs').promises;

const server = http.createServer((req, res) => {

    fs.writeFile(__dirname + '/headers.txt', JSON.stringify(req.headers)).then(data=>{
        console.log({data});
        // __dirname + '/headers.txt' 建立檔案txt
        // JSON.stringify(req.headers) 
        // then(data=> 錯誤情況

        res.writeHead(200, {
        'Content-Type': 'text/html'
        });

        res.end('<h2>abcde</h2>')
    })






});
 
server.listen(3000);