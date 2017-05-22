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

        console.log(data);
        //成功后返回effects yield结果
        return data.data.code>0?true:false;
  },
  login:function*(loginInfo){
      console.log(objToQuery(loginInfo));
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
      if(parseInt(data.data.code) >=1){
            localStorage.token=data.data.token;
            return true;
        }else{
            return false;
        }
      }
};

export default {

  namespace: 'login',
  state: {
    status: false,
    alert: "none"
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen(({pathname})=>{
    //     if(pathname!="/login"){
    //       dispatch({type:"getAuth"});
    //     }
    //   });
    // },
  },
  effects: {
    *getAuth({}, { call, put }) { 
      if(!(yield call(LoginFetch.check))){
        yield put(routerRedux.push('/login'));
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
    }
  },
};
