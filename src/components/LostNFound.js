import React from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

class LostNFound extends React.Component {
    formRef = React.createRef();

    onFinish = e => {
        this.formRef.current.resetFields();
        message.info('Please check your email for instruction on how to reset your password.', 3);
        console.log(e);
    }

    render() {
        return (
            <div id='forgot-wrapper'>
                <Link to="/login"><Button id='return-to-login' icon={<ArrowLeftOutlined />} shape='circle' size='large' ghost='true' style={{ position: 'absolute', top: '45%', left: '64px' }} /></Link>
                <div className='forgot'>
                    <p style={{ fontSize: '2em', color: 'white' }} className='no-select'><strong>Find Your Argus Account</strong></p>
                    <Form ref={this.formRef} name='forgot-form' id='forgot-form' onFinish={this.onFinish}>
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'We need either a user ID or email to retrieve your account'
                                },
                            ]}
                        >
                            <Input id='forgot-input' prefix={<UserOutlined className="site-form-item-icon" />} placeholder="User ID or Email" />
                        </Form.Item>
                        <Form.Item>
                            <Button id='find-account' icon={<SearchOutlined />} type='primary' htmlType='submit'>Search</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

export default LostNFound;
