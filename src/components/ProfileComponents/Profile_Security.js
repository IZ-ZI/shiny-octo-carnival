import { Button, Card, Divider } from "antd";
import React from "react";
import { withRouter } from "react-router";

class Profile_Security extends React.Component {
  mockData = {
    name: "mock user name",
    password: "*********",
    email: "email@example.com",
    mobileNum: "123-456-7890",
  };

  modifyName() {
    alert("modify name");
  }

  modifyEmail() {
    alert("modify email");
  }

  modifyPassword() {
    alert("modify password");
  }

  modifyPhone() {
    alert("modify phone number");
  }

  render() {
    return (
      <div id="security-wrapper">
        <h1 style={{ marginTop: "16px", fontSize: "2em" }}>
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
            <p>{this.mockData.name}</p>
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
            <p>{this.mockData.email}</p>
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
            <p>{this.mockData.password}</p>
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
            <p>{this.mockData.mobileNum}</p>
          </div>
        </Card>
      </div>
    );
  }
}
export default withRouter(Profile_Security);
