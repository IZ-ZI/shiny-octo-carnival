import React from "react";

import "antd/dist/antd.css";
import { Tabs } from "antd";

import Profile_Overview from "./ProfileComponents/Profile_Overview";
import Profile_Security from "./ProfileComponents/Profile_Security";
import Profile_ExAccount from "./ProfileComponents/Profile_ExAccount";

const { TabPane } = Tabs;

export default class Profile extends React.Component {
  render() {
    return (
      <div id="profile-wrapper">
        <Tabs
          type="card"
          size={"large"}
          tabPosition="left"
          className="no-select"
        >
          <TabPane tab="Overview" key="1">
            <Profile_Overview />
          </TabPane>
          <TabPane tab="Security" key="2">
            <Profile_Security />
          </TabPane>
          <TabPane tab="Argus Connect" key="3">
            <Profile_ExAccount />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
