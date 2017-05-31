"use strict";

require("babel-polyfill");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _configs = require("./utils/configs");

var _configs2 = _interopRequireDefault(_configs);

var _date = require("./utils/date");

var _date2 = _interopRequireDefault(_date);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _captchapng = require("captchapng");

var _captchapng2 = _interopRequireDefault(_captchapng);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _lib = require("./lib");

var _lib2 = _interopRequireDefault(_lib);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = _configs2.default.apiPort;

var app = new _express2.default();
app.use((0, _cookieParser2.default)());

app.use((0, _expressSession2.default)({
    secret: 'sessiontest',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 3600 * 24, secure: false }
}));

app.use(_bodyParser2.default.urlencoded({ extended: false }));

//监听登录
app.post('/login', function (req, res, next) {
    _lib2.default.loginStart(req, res);
});

//监听shoplist
app.post("/getShopList", function (req, res, next) {
    _lib2.default.getShopList(req, res, { userId: req.session.userId });
});

//监听loadAuth
app.post('/loadAuth', _lib2.default.loadAuth);

//监听获取excel
app.post('/getExcel', function (req, res, next) {
    var _req$body = req.body,
        shopname = _req$body.shopname,
        type = _req$body.type,
        startTime = _req$body.startTime,
        endTime = _req$body.endTime;

    switch (type) {
        case "1":
            _lib2.default.getGoodsList(req, res, { storesId: shopname });
            break;
        case "2":
            _lib2.default.getOrderList(req, res, { storesId: shopname, startTime: (0, _date2.default)(parseInt(startTime)), endTime: (0, _date2.default)(parseInt(endTime)) });
            break;
        case "3":
            _lib2.default.getCashierList(req, res, { storesId: shopname, startTime: (0, _date2.default)(parseInt(startTime)), endTime: (0, _date2.default)(parseInt(endTime)) });
            break;
        default:
            res.json(_configs2.default.reloadResponse);
    }
});

app.get(/file/, function (req, res, next) {
    var url = _configs2.default.yunposServer + ":" + _configs2.default.yunposPort;
    switch (req.originalUrl) {
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
            res.json({ code: 0 });
    }
    var startFetch = _lib2.default.initFetch("get", url);
    startFetch(req, res);
});

app.listen(port, _lib2.default.listen);
//# sourceMappingURL=index.js.map