import { routerRedux } from 'dva/router';
import request from "../utils/request";
import objToQuery from "../utils/objToQuery";

const LoginFetch = {
  check: function*(){
      let data = yield request('/api/loadAuth', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
            },
            credentials: 'include'
        });
        return data.data.code >0?true:false;
  },
  login:function*(loginInfo){
        let data = yield request('/api/login', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
            },
            body: objToQuery(loginInfo),
            credentials: 'include'
        });

        console.log(data);
        //成功后返回effects yield结果
        switch(parseInt(data.data.code)){
              case 200: return true;
              case 400: return false;
              default : return false;
        }
    },
    getShopList: function*(){
      let data = yield request('/api/getShopList', {
          method: 'POST',
          headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
          },
          credentials: 'include'
      });
      console.log(data);
      //成功后返回effects yield结果
      switch(parseInt(data.data.code)){
            case 200: return data;
            case 400: return false;
            default : return false;
        }
    },
    logout: function*(){
      let data = yield request('/api/logout', {
          method: 'POST',
          headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
          },
          credentials: 'include'
      });
      //成功后返回effects yield结果
      switch(parseInt(data.data.code)){
            case 1: return true;
            case 0: return false;
            default : return false;
        }
    }
};

export default {
  namespace: 'login',
  state: {
    status: false,
    alert: "none",
    shopList:[],
    netFail: false
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({pathname})=>{
        if(pathname!="/login"){
          dispatch({type:"getAuth"});
        }
      });
    },
  },
  effects: {
    *getAuth({}, { call, put }) {
        if(!(yield call(LoginFetch.check))){
              yield put(routerRedux.push('/login'));
        }else{
            var shopList = yield call(LoginFetch.getShopList);
            console.log(shopList);
            if(typeof shopList != null){
              yield put({type:"shopList",data:shopList.data.data});
            }else{
              alert("您的账户没有绑定的店铺，请绑定后使用！");
              yield put(routerRedux.push('/login'));
            }
        }
    },
    *loginStart({loginInfo},{call,put}){
      if(yield call(LoginFetch.login,loginInfo)){
          yield put({type:"loginOk"});
      }else{
          yield put({type:"showLoginFail"});
      }
    },
    *loginOk({},{put,call}){
      yield put(routerRedux.push('/'));
    },
    *logout({},{put,call}){
      const logoutResult = yield call(LoginFetch.logout);
      if(logoutResult){
        yield put(routerRedux.push("/login"));
      }else{
        alert("网络异常，请稍后再试！");
      }
    }
  },
  reducers: {
    showLoginFail(){
      return {alert: "block"};
    },
    loginWaiting(){
      return {alert:"none"};
    },
    netFail(){
      return {netFail: true};
    },
    shopList(state,{data}){
      return {shopList: data};
    }
  },
};
