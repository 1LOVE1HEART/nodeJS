require('dotenv').config();
const { doesNotThrow } = require('assert');
const express = require('express');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const moment = require('moment-timezone');
const db = require(__dirname + '/modules/db_connect2.js');
const sessionStore = new MysqlStore({}, db);

// const multer = require('multer');
// const upload = multer({dest: 'tmp_uploads/'});

const upload = require(__dirname + '/modules/upload-img')
const fs = require('fs').promises;



const app = express();

app.set('view engine', 'ejs');
// set方法要放最前面


// top-level-middleware
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: "eeedkof13efec",
    store: sessionStore,
    cookie: {
        maxAge: 1_200_000,
        // 可以加_底線判讀
        // T02:58:07.298Z ,T時間(區隔日期) Z格林威治時區UTC 
    }
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next)=>{
    // 放在locals.會進到template(address的樣板頁面?)
    // 自己定義的 template helper functions
    res.locals.toDateString = (d)=> moment(d).format('YYYY-MM-DD');
    res.locals.toDatetimeString = (d)=> moment(d).format('YYYY-MM-DD  HH:mm:ss');
    

    next();
})

// routes↓↓↓↓

app.use(express.static('public'));
//靜態資料夾
// app.use(express.static(__dirname + '/public'));
// !比較精準的路徑方法

app.use(express.static('node_modules/bootstrap/dist'));
// bootstrap的資料夾,會視為第2個根目錄


app.get('/', (req, res) => {
    // res.send(`<h2>你好</h2>`);

    res.render('main', { name: 'Shinder Da Da' })
    // 樣板物件, ↑main樣板 ,然後要傳參數,樣板再解析回來
    // 後端的"呈現"
});


app.get('/abc', (req, res) => {
    res.send(`<h2>abc</h2>`);
});

app.get('/sales-json', (req, res) => {
    const sales = require(__dirname + '/data/sales');
    console.log(sales);
    res.render(`sales-json`, { sales });
});

app.get('/json-test', (req, res) => {
    // res.send({ name: '小新1', age: 30 });
    res.json({ name: '小新2', age: 30 });
});

app.get('/my-params/:action/:id?', (req, res) => {
    res.json(req.params);
});

app.get(/^\/m\/09\d{2}\-?\d{3}\-?\d{3}$/, (req, res) => {
    let u = req.url.slice(3); // 切到剩m以後
    u = u.split('?')[0]; //去掉 query string
    u = u.split('-').join(''); // 去掉 '-'
    res.json({ mobile: u });
});

app.use('/admin2', require(__dirname + '/routes/admin2')); // 路由模組化,方便管理,可以抽換?

const myMiddle = (req, res, next) => {
    res.locals = { ...res.locals, Shinder: 'good morning' }; // locals是原本的物件,這個方法是'...'解構然後可以再放多個物件
    res.locals.cat = 'meow~'; //只增放1個
    next();
};

app.get('/admin2', [myMiddle], (req, res) => {
    res.json(res.locals);
    // 中括號-陣列,為了以後可以放多個middleware參照
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
    res.json(req.file);

    // if(req.file && req.file.originalname){
    //     await fs.rename(req.file.path, `public/imgs/${req.file.originalname}`);
    //     res.json(req.file);
    // } else {
    //     res.json({msg:'沒有上傳檔案'});
    // }
    // single單一檔案
});


app.post('/try-upload2', upload.array('photos'), async (req, res) => {
    res.json(req.files);
    // array 多檔案
})



app.get('/try-session', (req, res) => {
    req.session.aaa ||= 0; // 預設值 
    req.session.aaa++;
    res.json(req.session);
});


app.get('/try-date', (req, res) => {
    const now = new Date;
    const m = moment();
    const themoment = moment('06/10/22', 'YYYY-MM-DD');

    res.send({
        t1: now,
        // "t1": "2022-10-14T02:59:53.581Z",
        t2: now.toString(),
        // "t2": "Fri Oct 14 2022 10:59:53 GMT+0800 (台北標準時間)",
        t3: now.toDateString(),
        // "t3": "Fri Oct 14 2022",
        t4: now.toLocaleString(),
        // "t4": "2022/10/14 上午10:59:53",
        m1: m.format(),
        // "m1": "2022-10-14T10:59:53+08:00",
        m2: m.format('YYYY-MM-DD HH:mm:ss')
        // "m2": "2022-10-14 10:59:53" 
    });
});

app.get('/try-moment', (req, res) => {
    const fm = 'YYYY-MM-DD HH:mm:ss';
    const m = moment('06/10/22', 'YYYY-MM-DD');

    res.json({
        m,
        // "m": "2006-10-21T16:00:00.000Z", 當地
        m1: m.format(fm),
        // "m1": "2006-10-22 00:00:00",
        m2: m.tz('Europe/London').format(fm)
        // "m2": "2006-10-21 17:00:00" 日光節約+1hr
    });
});


app.get('/try-db', async (req, res) => {
    const [rows] = await db.query("SELECT * FROM address_book LIMIT 5");
    res.json(rows);
});

app.get('/try-db-add', async (req, res) => {
    const name = '辣個男人';
    const email = 'theman@gmail.com';
    const mobile = '0918555666';
    const birthday = '1998-5-21';
    const address = '宜蘭縣';
    const sql = "INSERT INTO `address_book`(`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?,NOW())";



    const [result] = await db.query(sql,[name, email, mobile, birthday, address]);
    res.json(result);

    // const [{insertId, affectedRows}] = await db.query(sql, [name, email, mobile, birthday, address]);
    // res.json({insertId, affectedRows});
});


app.get('/try-db-add2', async (req, res) => {
    const name = '辣個男人';
    const email = 'theman@gmail.com';
    const mobile = '0918555666';
    const birthday = '1998-5-21';
    const address = '宜蘭縣';
    const sql = "INSERT INTO `address_book` SET ?";
    // 不建議這樣用

    const [result] = await db.query(sql,[{name, email, mobile, birthday, address, created_at: new Date()}]);
    // sid會自己填入,  creat_time不能為空值,要自己new
    res.json(result);
});



app.use('/ab',  require(__dirname + '/routes/address-book')) ;

app.use((req, res) => {
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