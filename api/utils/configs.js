"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _config;

var _configs = require("../../src/utils/configs");

var _configs2 = _interopRequireDefault(_configs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import ServerConfig from "../../src/utils/configs";

var config = (_config = {
    server: _configs2.default.server,
    apiPort: _configs2.default.apiPort,
    serverPort: _configs2.default.serverPort,
    yunposServer: "http://120.76.100.12", //http://192.168.1.129:9300/ http://183.234.63.50
    yunposPort: "9300"
}, _defineProperty(_config, "apiPort", "3060"), _defineProperty(_config, "yunposApi", {
    login: "/api/user/login",
    stores: "/api/user/store",
    goods: "/api/cashier/findByGoodsExport",
    orders: "/api/order/findGoodsExport",
    cashiers: "/api/cashier/findBycashierExport"
}), _defineProperty(_config, "reloadResponse", {
    code: 0,
    msg: "no auth"
}), _defineProperty(_config, "getServerUrl", function getServerUrl(param) {
    if (this.yunposApi.hasOwnProperty(param)) {
        return this.yunposServer + ":" + this.yunposPort + this.yunposApi[param];
    } else {
        throw "please check yunposAPIname, your input [" + prarm + "] does not exists!";
    }
}), _config);

exports.default = config;
//# sourceMappingURL=configs.js.map