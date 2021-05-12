import React from "react";
import "antd/dist/antd.css";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import reqwest from "reqwest";

class LostNFound extends React.Component {
  formRef = React.createRef();
  lostReq;
  state = { loading: false };

  onFinish = (e) => {
    this.setState({ loading: true });
    this.formRef.current.resetFields();

    this.lostReq = reqwest({
      url: "https://18.221.119.146:8000/oum/argusUtils/lossnfound/",
      method: "post",
      type: "json",
      contentType: "application/json",
      data: JSON.stringify(e),
      success: () => {
        this.setState({ loading: false });
        message.info(
          "A message has been sent to you by email with instructions on how to reset your password.",
          3
        );
      },
      error: () => {
        this.setState({ loading: false });
        message.error("Something went wrong. Please try again.", 3);
      },
    });
  };

  render() {
    return (
      <div id="forgot-wrapper">
        <Link to="/login">
          <Button
            id="return-to-login"
            icon={<ArrowLeftOutlined />}
            shape="circle"
            size="large"
            ghost="true"
            style={{ position: "absolute", top: "45%", left: "64px" }}
          />
        </Link>
        <div className="forgot">
          <p style={{ fontSize: "2em", color: "white" }} className="no-select">
            <strong>Find Your Argus Account</strong>
          </p>
          <Form
            ref={this.formRef}
            name="forgot-form"
            id="forgot-form"
            onFinish={this.onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message:
                    "We need either a user ID or email to retrieve your account",
                },
              ]}
            >
              <Input
                id="forgot-input"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="User ID or Email"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                loading={this.state.loading}
                id="find-account"
                htmlType="submit"
                icon={<SearchOutlined />}
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default LostNFound;
