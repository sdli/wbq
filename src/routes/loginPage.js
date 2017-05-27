import React from 'react';
import { connect } from 'dva';
import Layout from "../components/layout/layout.main";
import HeaderMenu from "../components/menu/headerMenu.js";
import ContentComponent from "../components/form/loginForm";

const LoginPage = ({login,dispatch,loading})=>{
  console.log(loading);
  const handleSubmit=function(loginData){
        dispatch({type:"login/loginStart",loginInfo:loginData});
  }

  return (
    <Layout 
      ContentComponent={<ContentComponent alert={login.alert} handleSubmit={handleSubmit} dispatch={dispatch} netFail={login.netFail} />} />
  );
}

export default connect(({login,loading})=>({login,loading}))(LoginPage);
