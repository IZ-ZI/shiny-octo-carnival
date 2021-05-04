import React from "react";
import Report from "./Report";
import Profile from "./Profile";
import Meeting from "./Meeting";
import Dashboard from "./Dashboard";

import logo_src from "../imgs/argus-logo-small.png";

import "antd/dist/antd.css";
import { notification, Layout, Menu } from "antd";
import { Redirect, Route, Switch } from "react-router-dom";
import {
  UserOutlined,
  DashboardFilled,
  ContactsFilled,
  FileFilled,
  SmileOutlined,
} from "@ant-design/icons";

const { Content, Sider } = Layout;

class AppContainer extends React.Component {
  componentDidMount() {
    // oh and we should probably stop that fancy particle effect in the background...
    document.getElementById("particles-js").style.display = "none";
    // why do we even need these haha...
    let greeting;
    let date = new Date();
    let now = date.getHours();
    if (now >= 5 && now <= 12) {
      greeting = "Good morning! We wish you a productive day ahead!";
    } else if (now > 12 && now <= 18) {
      greeting = "Good afternoon! How has your day been :)";
    } else {
      greeting = "It's getting late, but Argus will always be here for you :)";
    }
    setTimeout(function () {
      notification.open({
        message: "Welcome",
        description: greeting,
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        duration: "3",
      });
    }, 1000);
  }

  //some weird canvas issue with particles-js
  //this forces the canvas to 'initialize'
  componentWillUnmount() {
    window.dispatchEvent(new Event("resize"));
  }

  navToProfile() {
    this.props.history.push("/appcontainer/profile");
  }

  navToDashboard() {
    this.props.history.push("/appcontainer/dashboard");
  }

  navToMeeting() {
    this.props.history.push("/appcontainer/meeting");
  }

  navToReport() {
    this.props.history.push("/appcontainer/report");
  }

  render() {
    return (
      <Layout style={{ height: "100%", width: "100%" }}>
        <Layout>
          <Sider width={200} defaultCollapsed collapsible id="sider-bar">
            <div
              className="no-select"
              style={{
                margin: "40px 4px 0px",
                height: "54px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "16px",
                backgroundColor: "#17223b",
              }}
            >
              <img
                src={logo_src}
                draggable={false}
                height={40}
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
            <Menu
              id="sider-bar-container"
              mode="inline"
              theme="dark"
              defaultSelectedKeys={["3"]}
              style={{
                paddingTop: "40px",
                height: "100%",
                borderRight: 0,
                background: "transparent",
              }}
            >
              <Menu.Item
                key="1"
                icon={<UserOutlined style={{ fontSize: "125%" }} />}
                onClick={() => this.navToProfile()}
              >
                <span
                  className="no-select"
                  style={{ fontSize: "1.5em", fontWeight: "bold" }}
                >
                  My Argus
                </span>
              </Menu.Item>
              <Menu.Item
                key="2"
                icon={<DashboardFilled style={{ fontSize: "125%" }} />}
                onClick={() => this.navToDashboard()}
              >
                <span
                  className="no-select"
                  style={{ fontSize: "1.5em", fontWeight: "bold" }}
                >
                  Dashboard
                </span>
              </Menu.Item>
              <Menu.Item
                key="3"
                icon={<ContactsFilled style={{ fontSize: "125%" }} />}
                onClick={() => this.navToMeeting()}
              >
                <span
                  className="no-select"
                  style={{ fontSize: "1.5em", fontWeight: "bold" }}
                >
                  Meetings
                </span>
              </Menu.Item>
              <Menu.Item
                key="4"
                icon={<FileFilled style={{ fontSize: "125%" }} />}
                onClick={() => this.navToReport()}
              >
                <span
                  className="no-select"
                  style={{ fontSize: "1.5em", fontWeight: "bold" }}
                >
                  Reports
                </span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content className="scroll-container">
              <Redirect from="/appcontainer" to="/appcontainer/meeting" />
              <Switch>
                <Route path="/appcontainer/dashboard" component={Dashboard} />
                <Route path="/appcontainer/meeting" component={Meeting} />
                <Route path="/appcontainer/profile" component={Profile} />
                <Route path="/appcontainer/report" component={Report} />
              </Switch>
              <div id="bottom"></div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
export default AppContainer;
