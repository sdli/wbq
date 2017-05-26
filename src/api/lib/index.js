var config = require("../../utils/configs");
import fetchRequest from "../../utils/request";
var date = require("../utils/date");
var request = require("request");
var port = config.apiPort;
var co = require('co');


/**
 * 获取订单信息
 * @param {*请求数据} req 
 * @param {*返回数据} res 
 * @param {*商铺id} shopname 
 * @param {*起始时间} startTime 
 * @param {*终止时间} endTime 
 */
function getOrderList(req, res, shopname, startTime, endTime) {
    request.post({
        url: config.getServerUrl('orders'),
        body: JSON.stringify({ storesId: shopname, startTime: date(startTime), endTime: date(endTime) }),
        header: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": getToken(req)
        }
    }, function(err, httpResponse, body) {
        let result = JSON.parse(body);
        if (result.code == "200") {
            res.json(result);
        }
    });
}

/**
 * 获取收银台信息
 * @param {*请求数据} req 
 * @param {*返回数据} res 
 * @param {*商铺id} shopname 
 * @param {*起始时间} startTime 
 * @param {*终止时间} endTime 
 */
function getSalesList(req, res, shopname, startTime, endTime) {
    request.post({
        url: config.getServerUrl('cashiers'),
        body: JSON.stringify({ storesId: shopname, startTime: date(startTime), endTime: date(endTime) }),
        header: {
            "Content-type": "application/json;charset=UTF-8",
            "Authorization": getToken(req)
        }
    }, function(err, httpResponse, body) {
        let result = JSON.parse(body);
        if (result.code == "200") {
            res.json(result);
        }
    });
}

/**
 * 请求登录接口
 * @param {请求内容} req 
 * @param {返回内容} res 
 */
function loginStart(req, res) {
    let sess = req.session;
    let { username, password } = req.body;
    if (username && password) {
        request.post({
            url: config.getServerUrl('login'),
            body: JSON.stringify({
                phone: username,
                password: password
            }),
            header: {
                "Content-type": "application/json;charset=UTF-8"
            }
        }, function(err, httpResponse, body) {
            let result = JSON.parse(body);
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
        res.json(config.reloadResponse);
    }
}


/**
 * 获取店铺列表
 * @param {*请求参数} req 
 * @param {*请求参数} res 
 */
const InitFetch = function(met,url,vali) {
        const method = met;
        const validator = (typeof vali === "undefined" || vali == null)?vali:null;
        const tryToken = function(req) {
            var sess = req.session;
            var { username, password, token, expire } = sess;
            if (username && password && token && expire) {
                if (expire > Date.parse(new Date()) / 1000) {
                    return token;
                } else {
                    return false;
                }
            }
        };
        return function(req,res,initData){
            co(function*(){
            var realToken = tryToken(req);
            var sess = req.session;
            if (!realToken) {
                var result = yield fetchRequest(config.getServerUrl('login'), {
                    body: JSON.stringify({
                        phone: req.session.username,
                        password: req.session.password
                    }),
                    method: 'POST',
                    header: {
                        "Content-type": "application/json;charset=UTF-8"
                    }
                });
                console.log(result);
                if (result.data.code == "200") {
                    sess.token = result.data.data.access_token;
                    sess.userId = result.data.data.id;
                    sess.expire = Date.parse(new Date()) / 1000 + 10;
                    realToken = sess.token;
                }
            }
            console.log(realToken);
            if(method.toLowerCase() == "post"){
                request.post(Object.assign({body:JSON.stringify(initData)},{
                    headers: {
                        "Content-type": "application/json",
                        "authorization": realToken
                    },
                    url: url
                }),function(err,response,body){
                    let result = JSON.parse(body);
                    console.log(result);
                    if(result.code == "200"){
                        if(validator){
                            res.json(validator(result,req));
                        }else{
                            res.json(result);
                        }
                    }else{
                        res.json(config.reloadResponse);
                    }
                });
            }
        });
    }
}


/**
 * 加载认证
 * @param {*处理请求} req 
 * @param {*处理返回数据} res 
 * @param {*} next 
 */
function loadAuth(req, res, next) {
    let loginStatus = (typeof req.session.username === "undefined" || typeof req.session.password === "undefined") ? false : true;
    if (loginStatus) {
        let result = {
            code: '1',
            username: req.session.username,
            msg: 'login auth OK!'
        };
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.json(result);
    } else {
        let result = {
            code: '0',
            username: "steven?",
            msg: 'no auth!'
        };
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.json(result);
    }
}


/**
 * 监听端口号
 * @param {错误} error 
 */
function listen(error) {
    if (error) {
        console.error(error)
    } else {
        console.info("==> 🌎  API listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
    }
}

function downLoadExcel(){

}

const funcs = {
    getGoodsList: InitFetch("post",config.getServerUrl("goods"),function(result,req){var data = result;req.session.goodsExcel=data.data.url;data.data.url=config.server+":"+"port"+"/file/goodsExcel";return data;}),
    getOrderList: getOrderList,
    getSalesList: getSalesList,
    loginStart: loginStart,
    getShopList: InitFetch("post",config.getServerUrl("stores")),
    loadAuth: loadAuth,
    listen: listen
};

module.exports = funcs;