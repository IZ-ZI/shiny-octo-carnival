import React from "react";
import Avatar from "antd/lib/avatar/avatar";
import { withRouter } from "react-router-dom";
import { Form, Input, Modal, Button, Card, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  UndoOutlined,
  SmileOutlined,
  PhoneOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import reqwest from "reqwest";
import logo_src from "../../imgs/test_cat.jpg";

class Profile_Overview extends React.Component {
  formRef = React.createRef();
  state = {
    refreshing: false,
    profileData: {
      username: "loading...",
      email: "loading...",
      firstName: "loading...",
      lastName: "loading...",
      phone: "loading...",
    },
  };

  profileReq;
  requestProfile() {
    this.setState({ refreshing: true });
    this.profileReq = reqwest({
      url: "https://18.221.119.146:8000/ppm/managedClient/account/argus/",
      type: "json",
      method: "get",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        this.setState({ profileData: res.output });
        this.formRef.current.setFieldsValue({
          username: this.state.profileData["username"],
          email: this.state.profileData["email"],
          name:
            this.state.profileData["firstName"] +
            " " +
            this.state.profileData["lastName"],
          phone: this.state.profileData["phone"],
        });
        this.setState({ refreshing: false });
      },
      error: () => {
        message.error("Something went wrong.");
        this.setState({ refreshing: false });
      },
    });
  }

  componentDidMount() {
    //this.requestProfile();
  }

  changeAvatar() {
    alert("change avatar");
  }

  refreshProfile() {
    this.requestProfile();
  }

  componentWillUnmount() {
    if (this.profileReq) {
      this.profileReq.abort();
    }
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
    sessionStorage.clear();
    this.props.history.push("/login");
    document.getElementById("particles-js").style.display = "inline";
  }

  render() {
    return (
      <div id="overview-wrapper">
        <h1 style={{ fontSize: "2em", marginTop: "8px" }}>
          <strong>Info</strong>
        </h1>
        <Card bodyStyle={{ maxHeight: "400", overflow: "auto" }}>
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
              ref={this.formRef}
              style={{ marginTop: "16px" }}
              initialValues={{
                username: this.state.profileData["username"],
                email: this.state.profileData["email"],
                name: this.state.profileData["firstName"],
                phone: this.state.profileData["phone"],
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
              <span style={{ display: "inline-block", width: "90%" }}>
                <strong>Name</strong>
              </span>
              <Form.Item name="name">
                <Input
                  style={{
                    height: "40px",
                    width: "90%",
                  }}
                  disabled
                  prefix={<SmileOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <span style={{ display: "inline-block", width: "90%" }}>
                <strong>Phone Number</strong>
              </span>
              <Form.Item name="phone">
                <Input
                  style={{
                    height: "40px",
                    width: "90%",
                  }}
                  disabled
                  prefix={<PhoneOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
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
                  loading={this.state.refreshing}
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
