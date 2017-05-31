import config from "../utils/configs";
import fetchRequest from "../utils/request";
import date from "../utils/date";
import request from "request";
import co from 'co';

var port = config.apiPort;

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
 * 接口quest方法获取封装，一次callback
 * @param {*请求参数} req 
 * @param {*请求参数} res 
 */
const InitFetch = function(met,url,vali) {
        const method = met;
        const validator = (typeof vali !== "undefined" || vali != null)?vali:null;
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
                if (result.data.code == "200") {
                    sess.token = result.data.data.access_token;
                    sess.userId = result.data.data.id;
                    sess.expire = Date.parse(new Date()) / 1000 + 10;
                    realToken = sess.token;
                }
            }
            if(method.toLowerCase() == "post"){
                request.post(Object.assign({body:JSON.stringify(initData)},{
                    headers: {
                        "Content-type": "application/json",
                        "authorization": realToken
                    },
                    url: url
                }),function(err,response,body){
                    let result = JSON.parse(body);
                    if(result.code == "200"){
                        if(validator){
                            validator(result,req,res);
                        }else{
                            res.json(result);
                        }
                    }else{
                        res.json(config.reloadResponse);
                    }
                });
            }else{
                console.log(url);
                request({
                    mothod: "GET",
                    url: url,
                    headers:{
                        "authorization": realToken
                    }
                }).pipe(res);
            }
        });
    }
}

/**
 * 接口二次封装。第二个callback
 * @param {*接口类型} type 
 */
function downLoadUrl(type){
    return InitFetch("post",config.getServerUrl(type),function(result,req,res){
        var data = result;
        req.session[type]=data.data.url;
        data.data.url=config.server+":"+config.serverPort+"/api/file/"+type;
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
        console.info("==> 🌎  API listening on port %s.", port, port)
    }
}

/**
 * export整合
 */
const funcs = {
    getGoodsList: downLoadUrl("goods"),
    getOrderList: downLoadUrl("orders"),
    getCashierList: downLoadUrl("cashiers"),
    loginStart: loginStart,
    getShopList: InitFetch("post",config.getServerUrl("stores")),
    initFetch: InitFetch,
    loadAuth: loadAuth,
    listen: listen
};

module.exports = funcs;