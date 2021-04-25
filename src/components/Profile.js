import React from "react";

import "antd/dist/antd.css";
import { Tabs } from "antd";

import Profile_Overview from "./ProfileComponents/Profile_Overview";
import Profile_Security from "./ProfileComponents/Profile_Security";
import Profile_ExAccount from "./ProfileComponents/Profile_ExAccount";

const { TabPane } = Tabs;

export default class Profile extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };

  componentDidMount() {
    // reqwest({
    //     url: 'API URL',
    //     type: 'json',
    //     method: 'get',
    //     contentType: 'application/json',
    //     success: res => {
    //         this.setState({
    //             initLoading: false,
    //             data: res.results,
    //             list: res.results,
    //         });
    //     },
    // });
  }

  render() {
    return (
      <div id="profile-wrapper">
        <Tabs
          className="no-select"
          type="card"
          tabPosition="left"
          size={"large"}
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
