require('dotenv').config();
const express = require('express');
const multer = require('multer');
const upload = multer({dest: 'tmp_uploads/'});
const fs = require('fs').promises;



const app = express();

app.set('view engine', 'ejs');
// set方法要放最前面


// top-level-middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// routes↓↓↓↓

app.use(express.static('public'));
//靜態資料夾
// app.use(express.static(__dirname + '/public'));
// !比較精準的路徑方法

app.use(express.static('node_modules/bootstrap/dist'));
// bootstrap的資料夾,會視為第2個根目錄


app.get('/', (req, res)=>{
    // res.send(`<h2>你好</h2>`);

    res.render('main',{name: 'Shinder Da Da'})
    // 樣板物件, ↑main樣板 ,然後要傳參數,樣板再解析回來
    // 後端的"呈現"
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


app.post('/try-post', (req, res) => {
    res.json(req.body);
});
app.get('/try-post-form', (req, res) => {
    // res.render('try-post-form', {email:'', password:''});
    res.render('try-post-form');
});
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
});

app.post('/try-upload', upload.single('avatar'), async (req, res) => {
    if(req.file && req.file.originalname){
        await fs.rename(req.file.path, `public/imgs/${req.file.originalname}`);
        res.json(req.file);
    } else {
        res.json({msg:'沒有上傳檔案'});
    }
    // single單一檔案
});


app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    res.json(req.files);
    // array 多檔案
  })




app.use((req, res)=>{
    // use 可以任意方式來拜訪
    // res.type('text/plain');//純文字
    res.status(404).render('404.ejs');
    // 404路由要放最後??順序問題?或可能前面其他的路由路徑設定並不精準,所以放前面會容易被導向404??
});

const port = process.env.SERVER_PORT || 3002;
app.listen(port, () => {
    console.log(`server started, port: ${port}`);
});

// 之後都會用express