import React from 'react';
import { connect } from 'dva';
import Layout from "../components/layout/layout.main";
import HeaderMenu from "../components/menu/headerMenu.js";
import ContentComponent from "../components/form/loginForm";

const LoginPage = ({login,dispatch})=>{

  const handleSubmit=function(loginData){
        dispatch({type:"login/loginStart",loginInfo:loginData});
  }

  return (
    <Layout 
      ContentComponent={<ContentComponent alert={login.alert} handleSubmit={handleSubmit} dispatch={dispatch} />} />
  );
}

export default connect(({login})=>({login,}))(LoginPage);
