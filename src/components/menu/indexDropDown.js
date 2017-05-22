import React,{Component} from "react";
import { Layout, Menu, Icon } from 'antd';
const { SubMenu } = Menu;

const IndexSider = function(){
    return(
            <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%' }}
    >
        <SubMenu key="sub1" title={<span><Icon type="user" />首页</span>}>
        <Menu.Item key="1">下载报表</Menu.Item>
        </SubMenu>
    </Menu>
    );
}

export default IndexSider;