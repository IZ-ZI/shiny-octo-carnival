import React from 'react';
import 'antd/dist/antd.css';
import { Button, Result } from 'antd';
import { } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default class RegisterSuccess extends React.Component {
    returnToLogin() {
        this.props.history.push('/login');
    }

    render() {
        return (
            <div id='register-done-wrapper'>
                <Result className="no-select" status="success"
                    title="Registration Succesful!"
                    subTitle="A verification email has been sent to you. Please check you mail box."
                    extra={[
                        <Button onClick={() => this.returnToLogin()} type="primary" key="login">Back to Log in</Button>]} />
            </div>
        );
    }
}