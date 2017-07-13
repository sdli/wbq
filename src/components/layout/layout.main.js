import React,{Component} from "react";
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
import styles from "./style.css";

class MainLayout extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const {headerMenu,ContentComponent,IndexSider,UserInfoMenu} = this.props;
        return (
            <Layout>
                    <Header className="header">
                        <div className={styles.logo} >
                            <p style={{lineHeight:"31px",color:"#ffffff",fontSize:"18px"}}>温碧泉报表系统</p>    
                        </div>
                        {headerMenu}
                        {UserInfoMenu}
                    </Header>
                    <Content style={{ padding: '16px 50px' }}>
                        <Layout style={{ padding: '24px 0', background: '#fff' }}>
                            <Sider width={IndexSider?200:null} style={{ background: '#fff' }}>
                                {IndexSider}
                            </Sider>
                            <Content style={{ padding: '0 24px', minHeight: 280 }}>
                                {ContentComponent}
                            </Content>
                        </Layout>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <p>开发：云东家Web团队</p>
                        <p>感谢：蚂蚁金服 Ant-Design 版权所有：深圳前海云东家科技有限公司</p>
                    </Footer>
                </Layout>
        );
    }
}

export default MainLayout;