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