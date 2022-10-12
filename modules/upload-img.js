const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const extMap = {
'image/jpeg': '.jpg',
'image/png': '.png',
'image/gif': '.gif',
};


const fileFilter = (req, file, callback)=>{
    // !!extMap[file.mimetype]
    // !!相當轉換成布林值
    callback(null, !!extMap[file.mimetype])
    // 要完成要靠callback function回傳值回去,和promiss一樣
    // 錯誤先行
    // 第2個參數為ture存起來,false丟掉
};

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, __dirname + '/../public/uploads');
    },
    filename: (req, file, cb)=>{
        const ext = extMap[file.mimetype]; // 副檔名
        cb(null, uuidv4()+ext);
    }
});

const upload = multer({storage, fileFilter});
module.exports = upload;