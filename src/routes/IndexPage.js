import React from 'react';
import { connect } from 'dva';
import Layout from "../components/layout/layout.main";
import HeaderMenu from "../components/menu/headerMenu.js";
import ContentComponent from "../components/contents/indexContent";
import IndexSider from "../components/menu/indexDropDown";


const Contents = function({dispatch,src,ifDownload,shops}){
  return(
      <div style={{position:"relative",padding:"32px 0px",minHeight:"600px"}}>
        <div style={{width:"50%",float:"left"}}>
            <ContentComponent dispatch={dispatch} src={src} loading={ifDownload} shops={shops} />
        </div>
        <div style={{clear:"both"}}></div>
        <div style={{padding:"16px 0px"}}>
          <div style={{backgroundColor:"#f6f6f6",padding:"8px"}}>
            <p>注意事项：</p>
            <p>1. 此应用下载为原始数据；</p>
            <p>2. raw data数据量可能会较大，暂定下载起始时间间隔不超过1个月；</p>
          </div>
        </div>
      </div>
  );
};
function IndexPage({dispatch,fetch,login}) {
  return (
    <Layout 
      headerMenu={<HeaderMenu />} 
      ContentComponent={<Contents dispatch={dispatch} src={fetch.src} ifDownload={fetch.ifDownload} shops={login.shopList} />}
      IndexSider={<IndexSider />}
    />
  );
}

IndexPage.propTypes = {

};

export default connect(({fetch,login})=>{return {fetch,login,};})(IndexPage);
