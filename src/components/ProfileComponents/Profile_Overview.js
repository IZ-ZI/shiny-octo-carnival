import React from "react";
import Avatar from "antd/lib/avatar/avatar";
import { withRouter } from "react-router-dom";
import { Form, Input, Modal, Button, Card, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PoweroffOutlined,
  UndoOutlined,
} from "@ant-design/icons";

import logo_src from "../../imgs/test_cat.jpg";

class Profile_Overview extends React.Component {
  changeAvatar() {
    alert("change avatar");
  }

  refreshProfile() {
    alert("refresh profile");
  }

  tryLogout() {
    Modal.confirm({
      title: "Log out",
      content: "Are you sure you wish to sign out?",
      centered: true,
      okText: "Log out",
      cancelText: "Cancel",
      closable: false,
      onOk: () => {
        this.confirmLogout();
      },
    });
  }

  confirmLogout() {
    this.props.history.push("/login");
    document.getElementById("particles-js").style.display = "inline";
  }

  render() {
    return (
      <div id="overview-wrapper">
        <h1 style={{ fontSize: "2em", marginTop: "8px" }}>
          <strong>Info</strong>
        </h1>
        <Card>
          <div id="overview-avatar">
            <a
              id="overview-avatar-change"
              onClick={() => {
                this.changeAvatar();
              }}
            >
              <Avatar
                size={{
                  xs: 46,
                  sm: 52,
                  md: 64,
                  lg: 84,
                  xl: 84,
                  xxl: 92,
                }}
                icon={<UserOutlined />}
                src={logo_src}
                alt="Avatar"
              />
            </a>
            <p id="avatar-hint">Edit</p>
          </div>
          <div id="overview-info">
            <Form
              style={{ marginTop: "16px" }}
              initialValues={{
                username: ["username GET"],
                email: ["User email. Retrieved with GET"],
              }}
            >
              <span style={{ display: "inline-block", width: "90%" }}>
                <strong>Username</strong>
              </span>
              <Form.Item name="username">
                <Input
                  style={{ height: "40px", width: "90%" }}
                  disabled
                  prefix={<UserOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Divider />
              <span style={{ display: "inline-block", width: "90%" }}>
                <strong>Email</strong>
              </span>
              <Form.Item name="email">
                <Input
                  style={{ height: "40px", width: "90%" }}
                  disabled
                  prefix={<MailOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Divider />
              <span style={{ display: "inline-block", width: "44.5%" }}>
                <strong>First Name</strong>
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: "44.5%",
                  marginLeft: "1%",
                }}
              >
                <strong>Last Name</strong>
              </span>
              <Form.Item name="firstNlast_name">
                <Input.Group>
                  <Input
                    style={{ height: "40px", width: "44.5%" }}
                    defaultValue="first name GET"
                    disabled
                  />
                  <Input
                    style={{ height: "40px", width: "44.5%", marginLeft: "1%" }}
                    defaultValue="last name GET"
                    disabled
                  />
                </Input.Group>
              </Form.Item>
              <Divider />
              <div id="overview-button-wrapper">
                <Button
                  onClick={() => {
                    this.tryLogout();
                  }}
                  type="primary"
                  icon={<PoweroffOutlined />}
                  size="large"
                >
                  Log out
                </Button>
                <Button
                  onClick={() => {
                    this.refreshProfile();
                  }}
                  type="default"
                  icon={
                    <UndoOutlined style={{ transform: "rotate(135deg)" }} />
                  }
                  size="large"
                  style={{ marginLeft: "32px" }}
                >
                  Refresh
                </Button>
              </div>
            </Form>
          </div>
        </Card>
      </div>
    );
  }
}
export default withRouter(Profile_Overview);
