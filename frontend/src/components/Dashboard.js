import React from "react";
import { format } from "date-fns";
import {
  Row,
  Col,
  Tag,
  Card,
  Tooltip,
  Divider,
  message,
  Skeleton,
  Statistic,
  PageHeader,
} from "antd";

import {
  ClockCircleOutlined,
  CopyOutlined,
  CalendarOutlined,
  UserOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import reqwest from "reqwest";
import logo_src from "../imgs/test_cat.jpg";
import Dashboard_SevenDayGraph from "./DashboardComponents/Dashboard_SevenDayGraph";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.networkHandler = this.networkHandler.bind(this);
  }

  intervalID = 0;
  bannerReq;
  //avatarReq;
  graphReq;

  state = {
    bannerLoading: true,
    graphLoading: true,
    graphData: [],
    network: navigator.onLine ? "online" : "offline",
    tReport: "Loading...",
    tMeeting: "Loading...",
    wMeeting: "Loading...",
    avatar: <UserOutlined style={{ color: "#1890ff" }} />,
    timeStamp: <SyncOutlined spin={true} style={{ color: "#1890ff" }} />,
  };

  updateTime() {
    this.intervalID = setInterval(() => {
      this.setState({
        timeStamp: format(new Date(), "PPpp"),
      });
    }, 1000);
  }

  getBannerData() {
    this.bannerReq = reqwest({
      url: "https://3.131.58.107:8000/ppm/managedClient/account/meetingstats/",
      type: "json",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        this.setState({
          tReport: res.output["report"],
          tMeeting: res.output["today"],
          wMeeting: res.output["week"],
          bannerLoading: false,
        });
      },
      error: () => {
        message.error("Something went wrong.");
      },
    });
  }

  getGraphData() {
    this.graphReq = reqwest({
      url: "https://3.131.58.107:8000/ppm/managedClient/account/meetinggraph/",
      type: "json",
      method: "get",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        this.setState({ graphData: res.output, graphLoading: false });
      },
      error: () => {
        message.error("Something went wrong.");
      },
    });
  }

  networkHandler(event) {
    this.setState({ network: event.type });
  }

  bindInternetListeners() {
    window.addEventListener("online", this.networkHandler);
    window.addEventListener("offline", this.networkHandler);
  }

  releaseInternetListeners() {
    window.removeEventListener("online", this.networkHandler);
    window.removeEventListener("offline", this.networkHandler);
  }

  componentDidMount() {
    this.updateTime();
    this.getGraphData();
    this.getBannerData();
    this.bindInternetListeners();
    //this.avatarReq =  ;
  }

  componentWillUnmount() {
    //this.avatarReq.abort();
    this.graphReq.abort();
    clearInterval(this.intervalID);
    this.releaseInternetListeners();
  }

  render() {
    return (
      <div id="dashboard-wrapper">
        <PageHeader
          className="no-select"
          ghost={false}
          title="Flight Control 🚀"
          avatar={{ src: logo_src, size: "large" }}
          tags={
            <Tooltip
              placement="right"
              title="Connection Status"
              getPopupContainer={(trigger) => trigger.parentElement}
            >
              <Tag
                color={this.state.network === "online" ? "success" : "error"}
              >
                {this.state.network}
              </Tag>
            </Tooltip>
          }
          extra={<h1 style={{ fontSize: "2em" }}>{this.state.timeStamp}</h1>}
        />
        <Row
          className="no-select"
          gutter={(16, 40)}
          align="center"
          style={{
            marginTop: "16px",
          }}
        >
          <Col span={7}>
            <Card>
              <Statistic
                title="Today's Meetings"
                prefix={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
                value={this.state.tMeeting}
              />
            </Card>
          </Col>
          <Divider type="vertical" style={{ height: 120 }} />
          <Col span={7}>
            <Card>
              <Statistic
                title="Weekly Forecast"
                prefix={<CalendarOutlined style={{ color: "#1890ff" }} />}
                value={this.state.wMeeting}
              />
            </Card>
          </Col>
          <Divider type="vertical" style={{ height: 120 }} />
          <Col span={7}>
            <Card>
              <Statistic
                title="Available Reports"
                prefix={<CopyOutlined style={{ color: "#1890ff" }} />}
                value={this.state.tReport}
              />
            </Card>
          </Col>
        </Row>
        <Skeleton
          active
          loading={this.state.graphLoading}
          paragraph={{ rows: 16 }}
        >
          <Dashboard_SevenDayGraph data={this.state.graphData} />
        </Skeleton>
      </div>
    );
  }
}
export default Dashboard;
