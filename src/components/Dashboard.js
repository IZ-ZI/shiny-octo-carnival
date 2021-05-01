import React from "react";
import moment from "moment";
import {
  Row,
  Col,
  Tag,
  Card,
  Tooltip,
  Divider,
  Statistic,
  PageHeader,
  Skeleton,
} from "antd";
import {
  ClockCircleOutlined,
  CopyOutlined,
  CalendarOutlined,
  UserOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import reqwest from "reqwest";
import Dashboard_SevenDayGraph from "./DashboardComponents/Dashboard_SevenDayGraph";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.networkHandler = this.networkHandler.bind(this);
  }

  state = {
    loading: true,
    graphData: [],
    network: "online",
    tReport: "Loading...",
    tMeeting: "Loading...",
    wMeeting: "Loading...",
    avatar: <UserOutlined style={{ color: "#1890ff" }} />,
    timeStamp: <SyncOutlined spin={true} style={{ color: "#1890ff" }} />,
  };

  updateTime() {
    setInterval(() => {
      this.setState({ timeStamp: moment().format("MMMM Do YYYY, h:mm:ss a") });
    }, 1000);
  }

  getGraphData() {
    reqwest({
      url: "https://my.api.mockaroo.com/dash_meetings.json.json?key=55a70d70",
      type: "json",
      method: "get",
      success: (res) => {
        this.setState({ graphData: res, loading: false });
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
    this.bindInternetListeners();
    reqwest({
      url: "https://randomuser.me/api/?result=1&inc=picture",
      type: "json",
      method: "get",
      contentType: "application/json",
      success: (res) => {
        this.setState({
          avatar: res.results[0].picture.thumbnail,
        });
      },
    });
  }

  componentWillUnmount() {
    this.releaseInternetListeners();
  }

  render() {
    return (
      <div id="dashboard-wrapper">
        <PageHeader
          className="no-select"
          ghost={false}
          title="Flight Control 🚀"
          avatar={{ src: this.state.avatar, size: "large" }}
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
                value={this.state.tMeeting}
              />
            </Card>
          </Col>
          <Divider type="vertical" style={{ height: 120 }} />
          <Col span={7}>
            <Card>
              <Statistic
                title="Available Reports"
                prefix={<CopyOutlined style={{ color: "#1890ff" }} />}
                value={this.state.tMeeting}
              />
            </Card>
          </Col>
        </Row>
        <Skeleton active loading={this.state.loading} paragraph={{ rows: 16 }}>
          <Dashboard_SevenDayGraph data={this.state.graphData} />
        </Skeleton>
      </div>
    );
  }
}
export default Dashboard;
