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

        //成功后返回effects yield结果
        return data.data.code>0?true:false;
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

      //成功后返回effects yield结果
      switch(parseInt(data.data.code)){
            case 200: return true;break;
            case 400: return false;break;
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
      //成功后返回effects yield结果
      switch(parseInt(data.data.code)){
            case 200: return data;break;
            case 400: return false;break;
            default : return false;
        }
      },
};

export default {
  namespace: 'login',
  state: {
    status: false,
    alert: "none",
    shopList:[]
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
        if(shopList){
          yield put({type:"shopList",data:shopList.data.data});
        }else{
          yield put(routerRedux.push('/login'));
        }
      }
    },
    *loginStart({loginInfo},{call,put}){
      if(!(yield call(LoginFetch.login,loginInfo))){
        yield put({type:"showLoginFail"});
      }else{
        yield put({type:"loginOk"});
      }
    },
    *loginOk({},{put,call}){
      yield put(routerRedux.push('/'));
    }
  },
  reducers: {
    showLoginFail(){
      return {alert: "block"};
    },
    loginWaiting(){
      return {alert:"none"};
    },
    shopList(state,{data}){
      return {shopList: data};
    }
  },
};
