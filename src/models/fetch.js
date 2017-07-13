import { routerRedux } from 'dva/router';
import request from "../utils/request";
import objToQuery from "../utils/objToQuery";
import config from "../utils/configs";

const fetchExcel = {
  start:function*(values){
      let data = yield request('/api/getExcel', {
          method: 'POST',
          headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
          },
          body: objToQuery(values),
          credentials: 'include'
      });

      //成功后返回effects yield结果
      if(parseInt(data.data.code) >=1){
            return  data.data.data.url;
        }else{
            return false;
        }
      }
};

export default {
  namespace: 'fetch',
  state: {
    ifDownload: false,
    src: ""
  },
  effects: {
    *getExcel({values}, { call, put }) {
        yield put({type:"downloading"});
        const result = yield call(fetchExcel.start,values);
      if(result){
        yield put({type:"downloadOk",src:result});
      }
    }
  },
  reducers: {
    downloadOk(state,{src}){
        return {ifDownload: false,src:src};
    },
    downloading(state){
        return {ifDownload: true}
    }
  }
};
