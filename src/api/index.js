var app = new(require('express'))();
var bodyParser = require("body-parser");
var config = require("../utils/configs");

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
app.post("/getShopList", function(req, res, next) { co(apis.getShopList(req, res)); });

//监听loadAuth
app.post('/loadAuth', apis.loadAuth);

//监听获取excel
app.post('/getExcel', function(req, res, next) {
    let { shopname, type, startTime, endTime } = req.body;
    switch (type) {
        case "1":
            apis.getGoodsList(req, res, shopname);
            break;
        case "2":
            apis.getOrderList(req, res, shopname, startTime, endTime);
            break;
        case "3":
            apis.getSalesList(req, res, shopname, startTime, endTime);
            break;
        default:
            res.json(config.reloadResponse);
    }
});

app.listen(port, apis.listen);