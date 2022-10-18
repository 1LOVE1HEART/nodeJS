const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../modules/db_connect2.js');
const upload = require(__dirname + '/../modules/upload-img')

router.use((req, res, next) => {
    next();
});

// CRUD

// 新增資料
router.get('/add', async (req, res)=>{
    res.locals.title = '新增資料 | ' + res.locals.title;
    res.render('address-book/add')
});
router.post('/add', upload.none(), async (req, res)=>{
    // res.json(req.body);
    const output = {
        success: false,
        code: 0,
        error: {},
        postData: req.body, // 除錯用
    };

    // TODO: 檢查欄位的格式, 可以用 joi npm套件

    const sql = "INSERT INTO `address_book`( `name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?,?,?,?,?, NOW())";

    const [result] = await db.query(sql, [
        req.body.name,
        req.body.email,
        req.body.mobile,
        req.body.birthday || null, 
        req.body.address,
    ]);

    if(result.affectedRows) output.success = true;

    res.json(output);

});


// 編輯資料
router.get('/edit/:sid', async (req, res)=>{
    const sql = " SELECT * FROM address_book WHERE sid=?";
    const [rows] = await db.query(sql, [req.params.sid]);
    if(!rows || !rows.length){
        return res.redirect(req.baseUrl); // 跳轉到列表頁
    }
    // res.json(rows[0]);
    res.render('address-book/edit', rows[0])
});
router.put('/edit/:sid', async (req, res)=>{

    // res.render('address-book/edit')
});


router.get('/item/:id', async (req, res)=>{
    // 讀取單筆資料
});



// router.get(['/', '/list'], async (req, res) => {
    async function getListData(req){
    const perPage = 20;
    let page = +req.query.page || 1;
    // +加號把字串轉數字(型別轉換)
    if (page < 1) {
        return res.redirect(req.baseUrl);
        // 返回,不像php結束
    }

    let search = req.query.search ? req.query.search.trim() : '';
    // trim頭尾空白
    let where = ` WHERE 1 `; // 1指true 1後面要空格,where 資料搜尋的火車頭??讓後面條件可以接下去??
    if (search) {
        where += ` AND 
        (
            \`name\` LIKE ${db.escape('%' + search + '%')}
            OR
            \`address\` LIKE ${db.escape('%' + search + '%')}
        )`;
        // where += ` AND \`name\` LIKE ${db.escape('%' + search + '%')} `;
    }
    // res.type('text/plain; charset=utf-8');
    // return res.end(where);

    const t_sql = `SELECT COUNT(1) totalRows FROM address_book ${where}`;
    // totalRows = num(sid)可以自己改
    const [[{ totalRows }]] = await db.query(t_sql);

    let totalPages = 0;
    if (totalRows > 0) {
        totalPages = Math.ceil(totalRows / perPage);
        if (page > totalPages) {
            return res.redirect(`?page=${totalPages}`);
        }

        const sql = `SELECT * FROM address_book ${where} ORDER BY sid DESC LIMIT ${(page - 1) * perPage}, ${perPage}`;

        [rows] = await db.query(sql);
    }

    // res.json({totalRows, totalPages, perPage, page, rows});
//     res.render('address-book/list', { totalRows, totalPages, perPage, page, rows, search, query: req.query});
// });
    return {totalRows, totalPages, perPage, page, rows, search, query: req.query};
    }

    
router.get(['/', '/list'], async (req, res)=>{
    const data = await getListData(req);

    res.render('address-book/list', data);
});

router.get(['/api', '/api/list'], async (req, res)=>{
    res.json(await getListData(req));
});

module.exports = router;



// router.get('/', async (req, res)=>{
//     const perPage = 20;
//     let page = +req.query.page || 1;
//     if(page<1){
//         return res.redirect(req.baseUrl);
//     }
//     const t_sql = "SELECT COUNT(1) totalRows FROM address_book";
//     const [[{totalRows}]] = await db.query(t_sql);

//     let totalPages = 0;
//     if(totalRows>0){
//         totalPages = Math.ceil(totalRows/perPage);
//         if(page>totalPages) {
//             return res.redirect(`?page=${totalPages}`);
//         }


//     }


//     res.json({totalRows, totalPages, perPage, page});
// });

// module.exports = router;