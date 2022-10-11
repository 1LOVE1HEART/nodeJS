require('dotenv').config();
const express = require('express');

const app = express();

app.set('view engine', 'ejs');



app.use(express.static('public'));
//靜態資料夾
// app.use(express.static(__dirname + '/public'));
// !比較精準的路徑方法

app.use(express.static('node_modules/bootstrap/dist'));
// 會視為第2個根目錄


app.get('/', (req, res)=>{
    // res.send(`<h2>你好</h2>`);

    res.render('main',{name: 'Shinder Da Da'})
});

app.get('/abc', (req, res)=>{
    res.send(`<h2>abc</h2>`);
});

app.use((req, res)=>{
    res.type('text/plain');//純文字
    res.status(404).send('找不到頁面');
});


const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
    console.log(`server started, port: ${port}`);
});

// 之後都會用express