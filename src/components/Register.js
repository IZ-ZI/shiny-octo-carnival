import React from "react";
import "antd/dist/antd.css";
import reqwest from "reqwest";
import { Link } from "react-router-dom";
import logo_src from "../imgs/argus-logo-small.png";
import { PasswordInput } from "antd-password-input-strength";
import { Form, Input, Popover, Button, Checkbox, Modal } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
const pwdHint = (
  <div>
    <p>- At least one upper-cased letter.</p>
    <p>- At least one lower-cased letter.</p>
    <p>- At least one symbol.</p>
    <p>- At least one number.</p>
  </div>
);

class Register extends React.Component {
  state = { loading: false };
  registerReq;

  onFinish = (e) => {
    if (e.agreement === true) {
      this.setState({ loading: true });
      let payload = {
        email: e["email"],
        username: e["username"],
        password: e["pwd-2nd"],
      };
      this.registerReq = reqwest({
        url: "https://18.221.119.146:8000/oum/argusUtils/signup/",
        method: "put",
        type: "json",
        contentType: "application/json",
        data: JSON.stringify(payload),
        success: () => {
          this.props.history.push("/register/success");
        },
        error: () => {
          this.props.history.push("/register/failed");
        },
      });
    } else {
      Modal.warning({
        title: "Attention",
        content: "You must agree to the Terms and Conditions.",
        centered: true,
      });
    }
  };

  componentWillUnmount() {
    if (this.registerReq) {
      this.registerReq.abort();
    }
  }

  render() {
    return (
      <div id="register-wrapper">
        <div id="register-poster" className="no-select" />
        <div className="no-select" id="register-poster-logo">
          <img
            src={logo_src}
            style={{ filter: "brightness(0) invert(1)" }}
            draggable="false"
            width="102px"
          />
        </div>
        <div className="no-select" id="register-poster-content">
          <h2>Sign Up Now!</h2>
          <h4>
            <ul>
              <li>View and Manage All of Your Meetings.</li>
              <li>Generate Rich Meeting Reports.</li>
              <li>Track Meeting Performance.</li>
              <li>Register for Free!</li>
            </ul>
          </h4>
        </div>
        <div id="register-form">
          <span className="no-select" style={{ fontSize: "2em" }}>
            <strong>Register</strong>
          </span>
          <span className="no-select" style={{ marginLeft: "172px" }}>
            Or return to{" "}
            <Link
              to="/login"
              draggable="false"
              style={{ textDecoration: "underline navy" }}
            >
              Log in
            </Link>
          </span>
          <Form id="reg-form" onFinish={this.onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email.",
                },
              ]}
            >
              <Input
                style={{ height: "40px" }}
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please enter your username.",
                },
              ]}
            >
              <Input
                style={{ height: "40px" }}
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Popover
              placement="right"
              title={"Password should contain at least 8 characters"}
              content={pwdHint}
              trigger="click"
            >
              <Form.Item
                name="pwd-1st"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password.",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      let temp = getFieldValue("pwd-1st");
                      if (
                        !/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/.test(
                          temp
                        )
                      ) {
                        return Promise.reject("Password is too Weak!");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <PasswordInput
                  style={{ height: "40px" }}
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                />
              </Form.Item>
            </Popover>
            <Form.Item
              name="pwd-2nd"
              rules={[
                {
                  required: true,
                  message: "Please re-enter your password.",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    let ori = getFieldValue("pwd-1st");
                    let ree = getFieldValue("pwd-2nd");
                    if (ree !== ori) {
                      return Promise.reject("Passwords do not match!");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input.Password
                style={{ height: "40px" }}
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Re-enter your Password"
              />
            </Form.Item>
            <Form.Item className="no-select">
              <Form.Item name="agreement" valuePropName="checked" noStyle>
                <Checkbox>
                  By creating an account, I agree to the Terms and Privacy
                  Policy.
                </Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item className="no-select">
              <Button
                id="register-btn"
                style={{
                  marginTop: "0px",
                  minHeight: "45px",
                  width: "50%",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
                className="login-form-button"
              >
                Register Free Account
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
export default Register;
