import ServerConfig from "../../utils/configs";

const config = {
        server:ServerConfig.server,
        apiPort: ServerConfig.apiPort,
        serverPort: ServerConfig.serverPort,
        yunposServer: "http://120.76.100.12",//http://192.168.1.129:9300/ http://183.234.63.50
        yunposPort: "9300",
        apiPort: "3060",
        yunposApi:{
            login: "/api/user/login",
            stores: "/api/user/store",
            goods: "/api/cashier/findByGoodsExport",
            orders: "/api/order/findGoodsExport",
            cashiers: "/api/cashier/findBycashierExport"
        },
        reloadResponse:{
            code:0,
            msg:"no auth"
        },
        getServerUrl: function(param){
            if(this.yunposApi.hasOwnProperty(param)){
                return this.yunposServer+":"+this.yunposPort + this.yunposApi[param];
            }else{
                throw "please check yunposAPIname, your input [" + prarm + "] does not exists!";
            }
        }
};

export default config;