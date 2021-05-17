import React from "react";
import "antd/dist/antd.css";
import reqwest from "reqwest";
import { Link } from "react-router-dom";
import logo_src from "../imgs/argus-logo-small.png";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

class Login extends React.Component {
  loginRef = React.createRef();

  state = {
    signInLoading: false,
  };

  componentDidMount() {
    setTimeout(() => window.dispatchEvent(new Event("resize")), 1);
    if (localStorage.getItem("rememberName")) {
      this.loginRef.current.setFieldsValue({
        username: localStorage.getItem("rememberName"),
        password: localStorage.getItem("rememberPwd"),
        remember: true,
      });
    }
  }

  loginReq;
  onFinish = (e) => {
    this.setState({ signInLoading: true });
    this.loginReq = reqwest({
      url: "https://3.131.58.107:8000/oum/argusUtils/login/",
      method: "post",
      type: "json",
      contentType: "application/json",
      data: JSON.stringify(e),
      success: (res) => {
        this.setState({ signInLoading: false });
        if (e.remember === true) {
          localStorage.setItem("rememberName", e.username);
          localStorage.setItem("rememberPwd", e.password);
        } else {
          localStorage.clear();
        }
        sessionStorage.setItem("sessionKey", res.output["X-API-SESSION"]);
        this.props.history.push("/appcontainer");
      },
      error: () => {
        localStorage.clear();
        this.setState({ signInLoading: false });
        message.error("Login failed. Please check you credentials.", 3);
      },
    });
  };

  componentWillUnmount() {
    if (this.loginReq) {
      this.loginReq.abort();
    }
  }

  render() {
    return (
      <div id="form-wrapper">
        <div id="login">
          <Form
            name="login_form"
            ref={this.loginRef}
            className="login_form"
            onFinish={this.onFinish}
            initialValues={{ remember: false }}
          >
            <Form.Item style={{ marginBottom: "9px", marginTop: "1px" }}>
              <img
                width="102px"
                src={logo_src}
                draggable="false"
                className="no-select"
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              ></img>
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address or username.",
                },
              ]}
            >
              <Input
                id="sign-in-id"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="User ID or Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password.",
                },
              ]}
            >
              <Input.Password
                id="sign-in-pwd"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item className="no-select">
              <Form.Item
                name="remember"
                id="sign-in-remember-flag"
                valuePropName="checked"
                noStyle
              >
                <Checkbox>
                  <strong>Remember Me</strong>
                </Checkbox>
              </Form.Item>
              <Link
                to="/forgot"
                className="forgot-link"
                style={{ float: "right", textDecoration: "underline navy" }}
                draggable="false"
              >
                Forgot password
              </Link>
            </Form.Item>
            <Form.Item className="no-select">
              <Button
                id="sign-in-btn"
                style={{
                  width: "50%",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={this.state.signInLoading}
              >
                Sign in
              </Button>
              <div style={{ marginTop: "1em" }}>
                <span>
                  Don't Have an Account?<br></br>
                </span>
                <Link
                  to="/register"
                  draggable="false"
                  style={{ textDecoration: "underline navy" }}
                >
                  Register Now!
                </Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
export default Login;
