import React from "react";
import { Button, Card, Divider, Popconfirm } from "antd";
import { withRouter } from "react-router";

class Profile_ExAccount extends React.Component {
  educateThePeople() {
    window.api.send("educate-zoom", "");
  }

  connectToZoom() {
    window.api.send("connect-zoom", sessionStorage.getItem("sessionKey"));
  }
  render() {
    return (
      <div id="external-account-wrapper">
        <h1 style={{ fontSize: "2em", marginTop: "8px" }}>
          <strong>Connect</strong>
        </h1>
        <Card>
          <div>
            <p>
              To release the full potential of Argus, we need your permission to
              access your Zoom profile and manage your meetings.&nbsp;Click to
              find out more, or connect your account.
            </p>
          </div>
          <div id="connect-button-wrapper">
            <Button
              type="primary"
              danger={true}
              size="large"
              style={{ width: "180px" }}
              onClick={() => {
                this.connectToZoom();
              }}
            >
              Connect to Zoom
            </Button>
            <Button
              type="default"
              size="large"
              style={{ width: "180px", marginLeft: "32px" }}
              onClick={() => {
                this.educateThePeople();
              }}
            >
              Learn More
            </Button>
          </div>
          <Divider />
        </Card>
      </div>
    );
  }
}
export default withRouter(Profile_ExAccount);
//export default Profile_ExAccount;
