var app = new(require('express'))();
var bodyParser = require("body-parser");
import config from "./utils/configs";
var request = require("request");
var date = require("./utils/date");
var port = config.apiPort;
var session = require("express-session");
var captchapng = require('captchapng');
var cookieParser = require("cookie-parser");
var path = require("path");
var apis = require("./lib");
var co = require('co');

app.use(cookieParser());

app.use(session({
    secret: 'sessiontest',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 3600 * 24, secure: false }
}));

app.use(bodyParser.urlencoded({ extended: false }));

//监听登录
app.post('/login', function(req, res, next) { apis.loginStart(req, res); });

//监听shoplist
app.post("/getShopList", function(req, res, next) { apis.getShopList(req, res,{userId:req.session.userId}); });

//监听loadAuth
app.post('/loadAuth', apis.loadAuth);

//监听获取excel
app.post('/getExcel', function(req, res, next) {
    let { shopname, type, startTime, endTime } = req.body;
    switch (type) {
        case "1":
            apis.getGoodsList(req, res, {storesId:shopname});
            break;
        case "2":
            apis.getOrderList(req, res, {storesId:shopname, startTime: date(parseInt(startTime)), endTime:date(parseInt(endTime))});
            break;
        case "3":
            apis.getCashierList(req, res, {storesId:shopname, startTime: date(parseInt(startTime)), endTime:date(parseInt(endTime))});
            break;
        default:
            res.json(config.reloadResponse);
    }
});

app.get(/file/,function(req,res,next){
    let url = config.yunposServer+":"+config.yunposPort;
    switch (req.originalUrl){
        case "/file/goods":
            url += req.session.goods;
            break;
        case "/file/orders":
            url += req.session.orders;
            break;
        case "/file/cashiers":
            url += req.session.cashiers;
            break;
        default:
            res.json(
                {code:0}
            );
    }
    let startFetch = apis.initFetch("get",url);
    startFetch(req,res);
});

app.listen(port, apis.listen);