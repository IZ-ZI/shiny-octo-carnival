import { Button, Card, Divider, PageHeader, Tag, Tooltip } from "antd";
import {
  AppstoreAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import reqwest from "reqwest";
import MeetingList from "./MeetingComponents/MeetingList";
import CreateMeeting from "./MeetingComponents/CreateMeeting";

const URL =
  "https://18.221.119.146:8000/ppm/managedClient/account/meetingscheduler/";

export default class Meeting extends React.Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }

  state = {
    modalVisible: false,
    zoomConnected: true,
  };

  handleCancel() {
    this.setState({ modalVisible: false });
  }

  render() {
    return (
      <div id="meeting-wrapper">
        <PageHeader
          id="sticky-header"
          ghost={false}
          title="My Meetings"
          className="no-select"
          subTitle="View and manage meetings"
          extra={
            <Tooltip
              placement="bottomRight"
              title="Zoom status"
              getPopupContainer={(trigger) => trigger.parentElement}
            >
              <Tag
                style={{ fontSize: "1em" }}
                color={this.state.zoomConnected == false ? "error" : "success"}
                icon={
                  this.state.zoomConnected == false ? (
                    <CloseCircleOutlined />
                  ) : (
                    <CheckCircleOutlined />
                  )
                }
              >
                Zoom
              </Tag>
            </Tooltip>
          }
        />
        <Divider />
        <Card
          title="All Meetings"
          className="no-select"
          id="meeting-list-card"
          bordered={false}
          style={{ padding: "8px" }}
        >
          <Button
            type="dashed"
            style={{ width: "100%" }}
            icon={<AppstoreAddOutlined />}
            onClick={() => {
              this.setState({ modalVisible: true });
            }}
          >
            New Meeting
          </Button>
          <MeetingList />
        </Card>
        <CreateMeeting
          isVisible={this.state.modalVisible}
          handleCancel={() => this.handleCancel}
        />
      </div>
    );
  }
}
