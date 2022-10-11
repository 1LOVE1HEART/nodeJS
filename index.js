require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.static('public'));
//靜態資料夾
// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
    res.send(`<h2>你好</h2>`);
});

app.get('/abc', (req, res)=>{
    res.send(`<h2>abc</h2>`);
});

app.use((req, res)=>{
    res.type('text/plain');//純文字
    res.status(404).send('找不到頁面');
});


const port = process.env.SERVER_PORT || 3002;
app.listen(3000, ()=>{
    console.log(`server started, PORT: ${port}`);
});

// 之後都會用express