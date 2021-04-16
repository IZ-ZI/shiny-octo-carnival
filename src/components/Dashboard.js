import React from 'react';
import LoadMoreContent from './LoadMoreContent';

import "antd/dist/antd.css";
import { Affix, Button, Layout, Menu } from 'antd';
import { UserOutlined, IdcardOutlined, TeamOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout

const Dashboard = () => {
    return (
        <Layout style={{ height: '100%', width: '100%' }}>
            <Affix>
                <Header className="header" style={{ userSelect: "none", width: '100%' }}>
                    <Button shape='circle' icon={<UserOutlined />} style={{marginLeft:'-25px'}}/>
                    {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{marginLeft: '30px', marginRight: "0", width: '100%', height: '100%',}}>
                    <Menu.Item key="1">NAV #1</Menu.Item>
                    <Menu.Item key="2">NAV #2</Menu.Item>
                    <Menu.Item key="3">NAV #3</Menu.Item>
                </Menu> */}
                </Header>
            </Affix>
            <Layout>
                <Sider width={200} defaultCollapsed collapsible style={{ height: "100%", userSelect: "none", background: "linear-gradient(28deg, rgba(238,174,202,1) 23%, rgba(148,187,233,1) 71%)", boxShadow: "5px 6px 10px 2px #888888" }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['2']}
                        style={{ paddingTop: '30px', height: '100%', borderRight: 0, background: 'transparent' }}
                    >
                        <SubMenu key="sub1" icon={<IdcardOutlined />} title="NAV #1">
                            <Menu.Item key="1">Section 1.1</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<TeamOutlined />} title="NAV #2">
                            <Menu.Item key="2">Section 2.1</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<NotificationOutlined />} title="NAV #3">
                            <Menu.Item key="3">Section 3.1</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content className="scroll-container">
                        <LoadMoreContent />
                        <div id="bottom"></div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};
export default Dashboard;