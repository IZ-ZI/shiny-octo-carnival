import React from 'react';
import ReactDom from 'react-dom';

import "antd/dist/antd.css";
import {Layout, Menu, Breadcrumb, Button, Alert} from 'antd';
import { WindowsFilled, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout

ReactDom.render(
    <Layout style={{height: '100%', width: '100%'}}>
        <Header className="header" style={{userSelect: "none", position: 'fixed', zIndex: 1, width: '100%'}}>
            <div className="logo"/>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{marginLeft: '30px', marginRight: "0", width: '100%', height: '100%',}}>
                <Menu.Item key="1">TOP #1</Menu.Item>
                <Menu.Item key="2">TOP #2</Menu.Item>
                <Menu.Item key="3">TOP #3</Menu.Item>
            </Menu>
        </Header>
            <Layout>
                <Sider width={200} defaultCollapsed collapsible className="sider-menu" style={{position: "fixed", height: "100%", userSelect: "none", background: "linear-gradient(28deg, rgba(238,174,202,1) 23%, rgba(148,187,233,1) 71%)", boxShadow: "5px 6px 10px 2px #888888"}}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ paddingTop: '30px', height: '100%', borderRight: 0, background: 'transparent'}}
                    >
                        <SubMenu key="sub1" icon={<UserOutlined />} title="NAV #1">
                            <Menu.Item key="1">Section 1.1</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<LaptopOutlined />} title="NAV #2">
                            <Menu.Item key="2">Section 2.1</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<NotificationOutlined />} title="NAV #3">
                            <Menu.Item key="3">Section 3.1</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Content
                        className="scroll-container"
                    >...
                    <br />
                    A
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    Really
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    Long
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    Table
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    Here
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    Goes
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    On
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    And
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    ...
                    <br />
                    On
                    </Content>
            </Layout>
        </Layout>
    </Layout>,
    document.getElementById('container'),
);