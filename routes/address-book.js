const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../modules/db_connect2.js');

router.use((req, res, next) => {
    next();
});

// CRUD

router.get(['/', '/list'], async (req, res) => {
    const perPage = 20;
    let page = +req.query.page || 1;
    // +加號把字串轉數字(型別轉換)
    if (page < 1) {
        return res.redirect(req.baseUrl);
        // 返回,不像php結束
    }

    let search = req.query.search ? req.query.search.trim() : '';
    // trim頭尾空白
    let where = ` WHERE 1 `; // 1是true 1後面要空格,where 資料搜尋的火車頭??讓後面條件可以接下去??
    if (search) {
        where += ` AND \`name\` LIKE ${db.escape('%' + search + '%')} `;
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
    res.render('address-book/list', { totalRows, totalPages, perPage, page, rows });
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