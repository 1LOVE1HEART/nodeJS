require('dotenv').config();
const express = require('express');

const app = express();

app.set('view engine', 'ejs');



app.use(express.static('public'));
//靜態資料夾
// app.use(express.static(__dirname + '/public'));
// !比較精準的路徑方法

app.use(express.static('node_modules/bootstrap/dist'));
// bootstrap的資料夾,會視為第2個根目錄


app.get('/', (req, res)=>{
    // res.send(`<h2>你好</h2>`);

    res.render('main',{name: 'Shinder Da Da'})
});

app.get('/abc', (req, res)=>{
    res.send(`<h2>abc</h2>`);
});

app.get('/sales-json', (req, res)=>{
    const sales = require(__dirname + '/data/sales');
    console.log(sales);
    res.render(`sales-json`, {sales});
});

app.get('/json-test', (req, res) => {
    // res.send({ name: '小新1', age: 30 });
    res.json({ name: '小新2', age: 30 });
});

app.get('/try-qs', (req, res) => {
    res.json(req.query);
});

app.use((req, res)=>{
    // res.type('text/plain');//純文字
    res.status(404).render('404.ejs');
    // 404路由要放最後??可能前面的路徑並不精準,所以放前面會被導向404??
});

const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
    console.log(`server started, port: ${port}`);
});

// 之後都會用express