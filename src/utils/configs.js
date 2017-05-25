const config ={
    server:"http://localhost",
    apiPort: "3060",
    serverPort: "8000",
    yunposServer: "http://120.76.100.12",
    yunposPort: "9300",
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

const ProConfig ={
    server:"http://localhost",
    apiPort: "3060",
    serverPort: "8000",
    yunposServer: "http://120.76.100.12",
    yunposPort: "9300",
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

module.exports = ProConfig;