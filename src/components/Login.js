import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo_src from '../imgs/argus-logo-small.png';

class Login extends React.Component {
    onFinish = e => {
        if (e.remember === true) {
            window.ipcRenderer.send('remember-true', [e.username, e.password]);
        } 
    }

    render() {
        return (
            <div id="form-wrapper">
                <div id="login">
                    <Form name="login_form" className="login_form" initialValues={{ remember: false, }} onFinish={this.onFinish}>
                        <Form.Item style={{ marginBottom: '9px', marginTop: '1px' }}>
                            <img src={logo_src} width='102px' draggable='false' style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}></img>
                        </Form.Item>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your email address or username.'
                                },
                            ]}
                        >
                            <Input id='sign-in-id' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="User ID or Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter your password.'
                                },
                            ]}
                        >
                            <Input.Password id='sign-in-pwd' prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
                        </Form.Item>
                        <Form.Item className="no-select">
                            <Form.Item id='sign-in-remember-flag' name="remember" valuePropName="checked" noStyle><Checkbox><strong>Remember Me</strong></Checkbox></Form.Item>
                            <Link to="/forgot" className="forgot-link" style={{ float: 'right', textDecoration: 'underline navy' }} draggable="false">Forgot password</Link>
                        </Form.Item>
                        <Form.Item className="no-select">
                            <Button id='sign-in-btn' style={{ width: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} type="primary" htmlType="submit" className="login-form-button">
                                Sign in
                            </Button>
                            <div style={{ marginTop: '1em' }}>
                                <span>Don't Have an Account?<br></br></span>
                                <Link to="/register" href="" draggable="false" style={{ textDecoration: 'underline navy' }}>Register Now!</Link>
                            </div>
                        </Form.Item>
                    </Form>
                </div >
            </div>
        );
    }
}
export default Login;