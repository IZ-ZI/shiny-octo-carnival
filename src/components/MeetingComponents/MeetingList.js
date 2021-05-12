import React from "react";
import reqwest from "reqwest";

import "antd/dist/antd.css";
import { Avatar, Tooltip, List, Tag, Button } from "antd";

import zoomIcon from "../../imgs/zoomIcon.png";
import regularMeeting from "../../imgs/meeting.png";

import {
  FileDoneOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const URL =
  "https://18.221.119.146:8000/ppm/managedClient/account/meetingscheduler/";

class MeetingList extends React.Component {
  meetingsReq;
  deleteReq;
  constructor(props) {
    super(props);
    this.monitorWindowHeight = this.monitorWindowHeight.bind(this);
  }

  state = {
    dynamicPageSize: Math.floor((window.innerHeight - 250) / 95),
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };

  getData = () => {
    this.meetingsReq = reqwest({
      url: URL,
      type: "json",
      method: "get",
      contentType: "application/json",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        this.setState({
          initLoading: false,
          data: JSON.parse(res.output),
          list: JSON.parse(res.output),
        });
      },
    });
  };

  deleteMeeting = (meetingID) => {
    this.deleteReq = reqwest({
      url: URL,
      type: "json",
      method: "delete",
      data: JSON.stringify({ id: meetingID }),
      contentType: "application/json",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: () => {
        this.getData();
        message.success("Meeting successfully deleted.");
      },
      error: () => {
        message.error("Something went wrong when processing your request.");
      },
    });
  };

  componentDidMount() {
    this.getData();
    window.api.receive("update-meeting-now", () => {
      this.getData();
    });
    window.addEventListener("resize", this.monitorWindowHeight);
  }

  monitorWindowHeight() {
    //wtf is this hack
    this.setState({
      dynamicPageSize: Math.floor((window.innerHeight - 250) / 95),
    });
  }

  componentWillUnmount() {
    if (this.meetingsReq) {
      this.meetingsReq.abort();
    }
    if (this.deleteReq) {
      this.deleteReq.abort();
    }
    window.removeEventListener("resize", this.monitorWindowHeight);
  }

  render() {
    const { initLoading, loading, list } = this.state;
    const statusIndicatorIcon = [
      <ClockCircleOutlined />,
      <SyncOutlined spin={true} />,
      <CheckCircleOutlined />,
      <FileDoneOutlined />,
    ];
    const statusIndicatorColor = [
      "default",
      "processing",
      "success",
      "warning",
    ];
    const statusIndicatorText = [
      "Meeting Scheduled",
      "Meeting in Progress",
      "Meeting Completed",
      "Reports Available",
    ];

    const zoomGeneral = [
      <Tooltip
        placement="leftBottom"
        title="Coming in Future Update"
        getPopupContainer={(trigger) => trigger.parentElement}
      >
        <Button className="meeting-list-actions" disabled={true} type="link">
          Delete
        </Button>
      </Tooltip>,
      <Tooltip
        placement="leftBottom"
        title="Coming in Future Update"
        getPopupContainer={(trigger) => trigger.parentElement}
      >
        <Button className="meeting-list-actions" disabled={true} type="link">
          More
        </Button>
      </Tooltip>,
    ];

    const zoomReport = [
      <Tooltip
        placement="leftBottom"
        title="Coming in Future Update"
        getPopupContainer={(trigger) => trigger.parentElement}
      >
        <Button className="meeting-list-actions" disabled={true} type="link">
          Delete
        </Button>
      </Tooltip>,
      <Button className="meeting-list-actions" type="link">
        View
      </Button>,
    ];

    const offlineGeneral = (key) => {
      return [
        <Button
          onClick={() => this.deleteMeeting(key)}
          className="meeting-list-actions"
          type="link"
        >
          Delete
        </Button>,
        <Button className="meeting-list-actions" type="link">
          Modify
        </Button>,
      ];
    };

    const offlineDisabled = [
      <Button className="meeting-list-actions" disabled={true} type="link">
        Delete
      </Button>,
      <Button className="meeting-list-actions" disabled={true} type="link">
        Modify
      </Button>,
    ];

    const offlineReport = [
      <Button className="meeting-list-actions" type="link">
        Delete
      </Button>,
      <Button className="meeting-list-actions" type="link">
        View
      </Button>,
    ];

    return (
      <List
        loading={initLoading}
        itemLayout="horizontal"
        pagination={{ pageSize: this.state.dynamicPageSize }}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={
              item.type === 0
                ? item.status === 3
                  ? zoomReport
                  : zoomGeneral
                : item.status === 0
                ? offlineGeneral(item.id)
                : item.status === 3
                ? offlineReport
                : offlineDisabled
            }
          >
            <List.Item.Meta
              avatar={
                <Tooltip
                  placement="topRight"
                  title={item.type === 0 ? "Zoom Meeting" : "In-person Meeting"}
                  getPopupContainer={(trigger) => trigger.parentElement}
                >
                  <Avatar
                    shape="circle"
                    src={item.type === 0 ? zoomIcon : regularMeeting}
                  />
                </Tooltip>
              }
              title={item.topic}
              description={item.date + ", " + item.time}
            />
            <Tag
              style={{ width: "146px", textAlign: "center" }}
              icon={statusIndicatorIcon[item.status]}
              color={statusIndicatorColor[item.status]}
            >
              {statusIndicatorText[item.status]}
            </Tag>
          </List.Item>
        )}
      />
    );
  }
}

export default MeetingList;
