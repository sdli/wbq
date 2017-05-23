import request from "./request.js";
import objToQuery from "./objToQuery";

const dataFetch = {
  getExcel:function*(values){
      console.log(objToQuery(values));
      let data = yield request('/api/getExcel', {
          method: 'POST',
          headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
          },
          body: objToQuery(values),
          credentials: 'include'
      });

      console.log(data);
      //成功后返回effects yield结果
      if(parseInt(data.data.code) >=1){
            return true;
        }else{
            return false;
        }
      }
};

export default dataFetch;