end,send,render,json都是回應客戶端後結束,路由內不要重複respone 舊版會報錯

res.end()
放檔頭
res.send()
字串 ,不要只填數字(判定會有問題??)
res.render()
放樣板檔頭 
res.json()
json格式


--------
RESTful API

CRUD
    C: POST
    R: GET
    U: PUT整筆更換 / (PATCH某些屬性更換)
    D: DELETE

--------
req.query  # query string (表單網址後面加?=的東西)
req.body   # 通常是表單資料

req.file
req.files

req.params # 路徑的參數(用在單純的前端傳參數,seo比較好)
