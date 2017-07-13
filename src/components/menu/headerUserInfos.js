import {Menu} from "antd";

const headerUserInfo = function({logoutFunc}){
    return (
        <div style={{width:200,height:64,position:"absolute",top:0,right:0,padding:"8px 16px",}}>
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '48px' }}
                onClick={function({item, key, keyPath}){
                    logoutFunc();
                }}
            >
                <Menu.Item key="1" style={{float:"right"}}>退出登录</Menu.Item>
            </Menu>
        </div>
    );
}

export default headerUserInfo;