import { Button, Card, Divider, Modal, Form, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router";
import reqwest from "reqwest";

class Profile_Security extends React.Component {
  state = {
    details: {
      firstName: "loading...",
      lastName: "",
      name: "loading...",
      email: "loading...",
      phone: "loading...",
    },
  };

  securityReq;
  requestProfile() {
    this.securityReq = reqwest({
      url: "https://18.221.119.146:8000/ppm/managedClient/account/argus/",
      type: "json",
      method: "get",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        this.setState({ details: res.output });
      },
      error: () => {
        message.error("Something went wrong.");
      },
    });
  }

  componentDidMount() {
    this.requestProfile();
  }

  componentWillUnmount() {
    this.securityReq.abort();
    if (this.nameRef) {
      this.nameRef.abort();
    }
    if (this.emailRef) {
      this.emailRef.abort();
    }
    if (this.pwdRef) {
      this.pwdRef.abort();
      window.dispatchEvent(new Event("resize"));
    }
    if (this.phoneReq) {
      this.phoneReq.abort();
    }
  }

  nameRef;
  toUpdateName = (e) => {
    if (e["firstName"] != null || e["lastName"] != null) {
      this.phoneReq = reqwest({
        url:
          "https://18.221.119.146:8000/ppm/managedClient/account/profile/name/",
        type: "json",
        method: "post",
        data: JSON.stringify(e),
        headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
        success: () => {
          message.success("Successfully updated name");
          this.requestProfile();
        },
        error: () => {
          message.error("An error occurred");
        },
      });
    }
  };

  modifyName() {
    let nameForm = React.createRef();
    Modal.info({
      className: "no-select",
      title: "Update Name",
      centered: true,
      content: (
        <>
          <Divider />
          <Form ref={nameForm} onFinish={this.toUpdateName}>
            <Form.Item name="firstName">
              <Input placeholder="first name" />
            </Form.Item>
            <Form.Item name="lastName">
              <Input placeholder="last name" />
            </Form.Item>
          </Form>
        </>
      ),
      onOk() {
        nameForm.current.submit();
      },
    });
  }

  emailRef;
  toUpdateEmail = (e) => {
    if (e["email"] != null) {
      this.phoneReq = reqwest({
        url:
          "https://18.221.119.146:8000/ppm/managedClient/account/profile/email/",
        type: "json",
        method: "post",
        data: JSON.stringify(e),
        headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
        success: () => {
          message.success("Successfully updated Email");
          this.requestProfile();
        },
        error: () => {
          message.error("An error occurred");
        },
      });
    }
  };

  modifyEmail() {
    let emailForm = React.createRef();
    Modal.info({
      className: "no-select",
      title: "Update Email",
      centered: true,
      content: (
        <>
          <Divider />
          <Form ref={emailForm} onFinish={this.toUpdateEmail}>
            <Form.Item name="email">
              <Input placeholder="email" />
            </Form.Item>
          </Form>
        </>
      ),
      onOk() {
        emailForm.current.submit();
      },
    });
  }

  forceLogout() {
    sessionStorage.clear();
    this.props.history.push("/login");
    document.getElementById("particles-js").style.display = "inline";
  }

  pwdRef;
  toUpdatePassword = (e) => {
    if (e["password"] != null) {
      this.pwdRef = reqwest({
        url:
          "https://18.221.119.146:8000/ppm/managedClient/account/profile/password/",
        type: "json",
        method: "post",
        data: JSON.stringify(e),
        headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
        success: () => {
          message.success(
            "Successfully updated password, you will be logged out in 3 seconds"
          );
          setTimeout(() => this.forceLogout(), 3000);
        },
        error: () => {
          message.error("An error occurred");
        },
      });
    }
  };

  modifyPassword() {
    let pwdForm = React.createRef();
    Modal.info({
      className: "no-select",
      title: "Update Password",
      centered: true,
      content: (
        <>
          <Divider />
          <Form ref={pwdForm} onFinish={this.toUpdatePassword}>
            <Form.Item name="password">
              <Input placeholder="password" />
            </Form.Item>
          </Form>
        </>
      ),
      onOk() {
        pwdForm.current.submit();
      },
    });
  }

  phoneReq;
  toUpdatePhone = (e) => {
    if (e["phone"] != null) {
      this.phoneReq = reqwest({
        url:
          "https://18.221.119.146:8000/ppm/managedClient/account/profile/phone/",
        type: "json",
        method: "post",
        data: JSON.stringify(e),
        headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
        success: () => {
          message.success("Successfully updated phone");
          this.requestProfile();
        },
        error: () => {
          message.error("An error occurred");
        },
      });
    }
  };

  modifyPhone() {
    let phoneForm = React.createRef();
    Modal.info({
      className: "no-select",
      title: "Update Phone Number",
      centered: true,
      content: (
        <>
          <Divider />
          <Form ref={phoneForm} onFinish={this.toUpdatePhone}>
            <Form.Item name="phone">
              <Input placeholder="phone number" />
            </Form.Item>
          </Form>
        </>
      ),
      onOk() {
        phoneForm.current.submit();
      },
    });
  }

  render() {
    return (
      <div id="security-wrapper">
        <h1 style={{ marginTop: "8px", fontSize: "2em" }}>
          <strong>Login & Security</strong>
        </h1>
        <Card>
          <div id="security-card-li-name">
            <p>
              <strong>Name</strong>
            </p>
            <Button
              type="default"
              style={{ position: "absolute", right: "32px" }}
              onClick={() => {
                this.modifyName();
              }}
            >
              Edit
            </Button>
            <p>
              {this.state.details["firstName"] === "" &&
              this.state.details["lastName"] === ""
                ? "N.A."
                : this.state.details["firstName"] +
                  " " +
                  this.state.details["lastName"]}
            </p>
          </div>
          <Divider />
          <div id="security-card-li-email">
            <p>
              <strong>Email</strong>
            </p>
            <Button
              type="default"
              style={{ position: "absolute", right: "32px" }}
              onClick={() => {
                this.modifyEmail();
              }}
            >
              Edit
            </Button>
            <p>{this.state.details["email"]}</p>
          </div>
          <Divider />
          <div id="security-card-li-password">
            <p>
              <strong>Password</strong>
            </p>
            <Button
              type="default"
              style={{ position: "absolute", right: "32px" }}
              onClick={() => {
                this.modifyPassword();
              }}
            >
              Edit
            </Button>
            <p>***********</p>
          </div>
          <Divider />
          <div id="security-card-li-phone">
            <p>
              <strong>Mobile Phone Number</strong>
            </p>
            <Button
              type="default"
              style={{ position: "absolute", right: "32px" }}
              onClick={() => {
                this.modifyPhone();
              }}
            >
              Edit
            </Button>
            <p>
              {this.state.details["phone"] === ""
                ? "N.A."
                : this.state.details["phone"]}
            </p>
          </div>
        </Card>
      </div>
    );
  }
}
export default withRouter(Profile_Security);
//export default Profile_Security;
