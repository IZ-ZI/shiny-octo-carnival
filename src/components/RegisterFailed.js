import React from "react";
import "antd/dist/antd.css";
import { Button, Result } from "antd";

export default class RegisterFailed extends React.Component {
  returnToLogin() {
    this.props.history.push("/login");
  }

  render() {
    return (
      <div id="register-done-wrapper">
        <Result
          className="no-select"
          status="error"
          title="Registration Failed!"
          subTitle="Something went wrong on our end. Please check back later."
          extra={[
            <Button
              onClick={() => this.returnToLogin()}
              type="primary"
              key="login"
            >
              Back to Log in
            </Button>,
          ]}
        />
      </div>
    );
  }
}
