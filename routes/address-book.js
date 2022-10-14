const express = require('express');
const router = express.Router();
const db = require(__dirname + '/../modules/db_connect2.js');

router.use((req, res, next)=>{
    next();
});

// CRUD

router.get('/', async (req, res)=>{
    const perPage = 20;
    let page = +req.query.page || 1;
    // +加號把字串轉數字
    if(page<1){
        return res.redirect(req.baseUrl);
    }
    const t_sql = "SELECT COUNT(1) totalRows FROM address_book";
    // totalRows = num(sid)可以自己改
    const [[{totalRows}]] = await db.query(t_sql);

    let totalPages = 0;
    if (totalRows>0){
        totalPages = Math.ceil(totalRows/perPage);
        if(page>totalPages) {
            return res.redirect(`?page=${totalPages}`);
        }

        const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(page-1)*perPage}, ${perPage}`;

        [rows] = await db.query(sql);
    }
    
    res.json({totalRows, totalPages, perPage, page, rows});
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