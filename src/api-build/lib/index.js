"use strict";

var _configs = require("../utils/configs");

var _configs2 = _interopRequireDefault(_configs);

var _request = require("../utils/request");

var _request2 = _interopRequireDefault(_request);

var _date = require("../utils/date");

var _date2 = _interopRequireDefault(_date);

var _request3 = require("request");

var _request4 = _interopRequireDefault(_request3);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = _configs2.default.apiPort;

/**
 * 请求登录接口
 * @param {请求内容} req 
 * @param {返回内容} res 
 */
function loginStart(req, res) {
    var sess = req.session;
    var _req$body = req.body,
        username = _req$body.username,
        password = _req$body.password;

    if (username && password) {
        _request4.default.post({
            url: _configs2.default.getServerUrl('login'),
            body: JSON.stringify({
                phone: username,
                password: password
            }),
            header: {
                "Content-type": "application/json;charset=UTF-8"
            }
        }, function (err, httpResponse, body) {
            var result = JSON.parse(body);
            if (result.code == "200") {
                sess.username = username;
                sess.password = password;
                sess.token = result.data.access_token;
                sess.userId = result.data.id;
                sess.expire = Date.parse(new Date()) / 1000 + 10;
                res.json(result);
            }
        });
    } else {
        res.json(_configs2.default.reloadResponse);
    }
}

/**
 * 接口quest方法获取封装，一次callback
 * @param {*请求参数} req 
 * @param {*请求参数} res 
 */
var InitFetch = function InitFetch(met, url, vali) {
    var method = met;
    var validator = typeof vali !== "undefined" || vali != null ? vali : null;
    var tryToken = function tryToken(req) {
        var sess = req.session;
        var username = sess.username,
            password = sess.password,
            token = sess.token,
            expire = sess.expire;

        if (username && password && token && expire) {
            if (expire > Date.parse(new Date()) / 1000) {
                return token;
            } else {
                return false;
            }
        }
    };
    return function (req, res, initData) {
        (0, _co2.default)(regeneratorRuntime.mark(function _callee() {
            var realToken, sess, result;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            realToken = tryToken(req);
                            sess = req.session;

                            if (realToken) {
                                _context.next = 7;
                                break;
                            }

                            _context.next = 5;
                            return (0, _request2.default)(_configs2.default.getServerUrl('login'), {
                                body: JSON.stringify({
                                    phone: req.session.username,
                                    password: req.session.password
                                }),
                                method: 'POST',
                                header: {
                                    "Content-type": "application/json;charset=UTF-8"
                                }
                            });

                        case 5:
                            result = _context.sent;

                            if (result.data.code == "200") {
                                sess.token = result.data.data.access_token;
                                sess.userId = result.data.data.id;
                                sess.expire = Date.parse(new Date()) / 1000 + 10;
                                realToken = sess.token;
                            }

                        case 7:
                            if (method.toLowerCase() == "post") {
                                _request4.default.post(Object.assign({ body: JSON.stringify(initData) }, {
                                    headers: {
                                        "Content-type": "application/json",
                                        "authorization": realToken
                                    },
                                    url: url
                                }), function (err, response, body) {
                                    var result = JSON.parse(body);
                                    if (result.code == "200") {
                                        if (validator) {
                                            validator(result, req, res);
                                        } else {
                                            res.json(result);
                                        }
                                    } else {
                                        res.json(_configs2.default.reloadResponse);
                                    }
                                });
                            } else {
                                console.log(url);
                                (0, _request4.default)({
                                    mothod: "GET",
                                    url: url,
                                    headers: {
                                        "authorization": realToken
                                    }
                                }).pipe(res);
                            }

                        case 8:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
    };
};

/**
 * 接口二次封装。第二个callback
 * @param {*接口类型} type 
 */
function downLoadUrl(type) {
    return InitFetch("post", _configs2.default.getServerUrl(type), function (result, req, res) {
        var data = result;
        req.session[type] = data.data.url;
        data.data.url = _configs2.default.server + ":" + _configs2.default.serverPort + "/api/file/" + type;
        console.log(req.session[type]);
        res.json(data);
    });
}

/**
 * 加载认证
 * @param {*处理请求} req 
 * @param {*处理返回数据} res 
 * @param {*} next 
 */
function loadAuth(req, res, next) {
    var loginStatus = typeof req.session.username === "undefined" || typeof req.session.password === "undefined" ? false : true;
    if (loginStatus) {
        var result = {
            code: '1',
            username: req.session.username,
            msg: 'login auth OK!'
        };
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.json(result);
    } else {
        var _result = {
            code: '0',
            username: "steven?",
            msg: 'no auth!'
        };
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.json(_result);
    }
}

/**
 * 监听端口号
 * @param {错误} error 
 */
function listen(error) {
    if (error) {
        console.error(error);
    } else {
        console.info("==> 🌎  API listening on port %s.", port, port);
    }
}

/**
 * export整合
 */
var funcs = {
    getGoodsList: downLoadUrl("goods"),
    getOrderList: downLoadUrl("orders"),
    getCashierList: downLoadUrl("cashiers"),
    loginStart: loginStart,
    getShopList: InitFetch("post", _configs2.default.getServerUrl("stores")),
    initFetch: InitFetch,
    loadAuth: loadAuth,
    listen: listen
};

module.exports = funcs;
//# sourceMappingURL=index.js.map