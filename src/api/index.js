var app = new (require('express'))();
var bodyParser = require("body-parser");
var config = require("../utils/configs");

var port = config.apiPort;
var session = require("express-session");
var captchapng = require('captchapng');
var cookieParser = require("cookie-parser");
var path = require("path");
var apis = require("./lib");

app.use(cookieParser());
app.use(session({
  secret: 'sessiontest',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000*3600*24, secure: false}
}));

app.use(bodyParser.urlencoded({ extended: false}));

//监听登录
app.post('/login',function(req,res,next){ apis.loginStart(req,res);});

//监听shoplist
app.post("/getShopList",function(req,res,next){ apis.getShopList(req,res); });

//监听loadAuth
app.post('/loadAuth',apis.loadAuth);

//监听获取excel
app.post('/getExcel',function(req,res,next){
    let {shopname,type,startTime,endTime} = req.body;
    switch (type){
        case "1": apis.getGoodsList(req,res,shopname);break;
        case "2": apis.getOrderList(req,res,shopname,startTime,endTime);break;
        case "3": apis.getSalesList(req,res,shopname,startTime,endTime);break;
        default:
              res.json(config.reloadResponse);
    }
});

app.get('/img',function(req,res,next){
    var pngNum = parseInt(Math.random()*9000+1000);
    req.session.pngNum = pngNum;
    var p = new captchapng(80,30,parseInt(Math.random()*9000+1000)); // width,height,numeric captcha 
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha) 
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha) 

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
    next();
});

app.get('/file',function(req,res,next){
    res.download(path.join(__dirname,"./lib/test.xls"),'test.xls');
});

app.post("/test",function(req,res,next){
    let result = {
        code : '1',
        test: "test",
        url: "http://47.93.224.216:3061/file"
    };
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Content-Type","application/json");
    res.json(result);
});

app.listen(port,apis.listen);