import React,{Component} from "react";
import {Menu} from "antd";

class HeaderMenu extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
            >
                <Menu.Item key="1">首页</Menu.Item>
            </Menu>
        );
    }
}

export default HeaderMenu;