import React from 'react';
import { connect } from 'dva';
import Layout from "../components/layout/layout.main";
import HeaderMenu from "../components/menu/headerMenu.js";
import ContentComponent from "../components/contents/indexContent";
import IndexSider from "../components/menu/indexDropDown";


const Contents = function(){
  return(
      <div style={{position:"relative",padding:"32px 0px"}}>
        <div style={{width:"50%",float:"left"}}>
            <ContentComponent />
        </div>
        <div style={{clear:"both"}}></div>
        <div style={{padding:"16px 0px"}}>
          <div style={{backgroundColor:"#f6f6f6",padding:"8px 0"}}>
            <p>注意事项：</p>
          </div>
        </div>
      </div>
  );
};
function IndexPage() {
  return (
    <Layout 
      headerMenu={<HeaderMenu />} 
      ContentComponent={<Contents />}
      IndexSider={<IndexSider />}
    />
  );
}

IndexPage.propTypes = {

};

export default connect()(IndexPage);
