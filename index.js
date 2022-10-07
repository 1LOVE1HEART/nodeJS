const express = require('express');

const app = express();

app.get('/', (req, res)=>{
    res.send(`<h2>你好</h2>`);
});

app.listen(3000, ()=>{
    console.log('server started');
});

// 之後都會用express