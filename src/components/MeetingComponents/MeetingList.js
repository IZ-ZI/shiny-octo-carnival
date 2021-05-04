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

const URL = `https://my.api.mockaroo.com/meetings?key=`;

class MeetingList extends React.Component {
  constructor(props) {
    super(props);
    this.monitorWindowHeight = this.monitorWindowHeight.bind(this);
  }

  state = {
    dynamicPageSize: 5,
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };

  componentDidMount() {
    reqwest({
      url: URL,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: (res) => {
        if (!Array.isArray(res)) {
          res = [res].flat();
        }
        this.setState({
          initLoading: false,
          data: res,
          list: res,
        });
      },
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
    window.removeEventListener("resize", this.monitorWindowHeight);
  }

  getData = (callback) => {
    reqwest({
      url: URL,
      type: "json",
      method: "get",
      contentType: "application/json",
      success: (res) => {
        callback(res);
      },
    });
  };

  //onLoadMore = () => {
  //this.setState({
  //loading: true,
  //list: this.state.data.concat(
  //[...new Array(numOfItems)].map(() => ({ loading: true, name: {} }))
  //),
  //});
  //this.getData((res) => {
  //const data = this.state.data.concat(res);
  //this.setState(
  //{
  //data,
  //list: data,
  //loading: false,
  //},
  //() => {
  //window.dispatchEvent(new Event("resize"));
  //var objDiv = document.getElementById("bottom");
  //objDiv.scrollIntoView({ behavior: "smooth" });
  //}
  //);
  //});
  //};

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
          onClick={() => alert(key["$oid"])}
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

    //const loadMore =
    //!initLoading && !loading ? (
    //<div
    //style={{
    //textAlign: "center",
    //marginTop: 12,
    //marginBottom: 42,
    //height: 32,
    //lineHeight: "32px",
    //}}
    //>
    //<Button onClick={this.onLoadMore}>Fetch Content</Button>
    //</div>
    //) : null;

    return (
      <List
        loading={initLoading}
        itemLayout="horizontal"
        pagination={{ pageSize: this.state.dynamicPageSize }}
        //loadMore={loadMore}
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
