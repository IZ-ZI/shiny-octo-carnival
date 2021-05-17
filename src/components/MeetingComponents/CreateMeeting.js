import React, { useEffect, useState } from "react";
import { Modal, Form, DatePicker, Input, Select, message } from "antd";
import reqwest from "reqwest";

const CreateMeeting = (props) => {
  let createReq;
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (form && !props.isVisible) {
      form.resetFields();
    }
  }, [props.isVisible]);

  const hours = [
    { value: 0, label: "0 hour" },
    { value: 1, label: "1 hour" },
    { value: 2, label: "2 hours" },
    { value: 3, label: "3 hours" },
    { value: 4, label: "4 hours" },
    { value: 5, label: "5 hours" },
    { value: 6, label: "6 hours" },
    { value: 7, label: "7 hours" },
    { value: 8, label: "8 hours" },
    { value: 9, label: "9 hours" },
    { value: 10, label: "10 hours" },
    { value: 11, label: "11 hours" },
    { value: 12, label: "12 hours" },
    { value: 13, label: "13 hours" },
    { value: 14, label: "14 hours" },
    { value: 15, label: "15 hours" },
    { value: 16, label: "16 hours" },
    { value: 17, label: "17 hours" },
    { value: 18, label: "18 hours" },
    { value: 19, label: "19 hours" },
    { value: 20, label: "20 hours" },
    { value: 21, label: "21 hours" },
    { value: 22, label: "22 hours" },
    { value: 23, label: "23 hours" },
    { value: 24, label: "24 hours" },
  ];

  const minutes = [
    { value: 0, label: "0 minute" },
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
  ];

  const disabledDate = (current) => {
    return current.valueOf() < Date.now() - 86400000;
  };

  const handleOK = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (e) => {
    setSubmitting(true);
    createReq = reqwest({
      url:
        "https://3.131.58.107:8000/ppm/managedClient/account/meetingscheduler/",
      type: "json",
      method: "post",
      data: JSON.stringify(e),
      contentType: "application/json",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: () => {
        message.success("Meeting successfully created.");
        window.api.send("should-update-meeting");
        setSubmitting(false);
        form.resetFields();
      },
      error: () => {
        setSubmitting(false);
        message.error("Something went wrong when creating your meeting.");
      },
    });
    return () => {
      setSubmitting(false);
      createReq.abort();
    };
  };

  const modalFooter = {
    okText: "Create",
    cancelText: "Close",
    okButtonProps: { loading: submitting },
    onOk: handleOK,
    onCancel: props.handleCancel(),
  };

  const constructModal = () => {
    return (
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 32 }}
        onFinish={handleFinish}
      >
        <Form.Item
          name="topic"
          label="Topic"
          rules={[
            { required: true, message: "Please define the meeting topic." },
          ]}
        >
          <Input placeholder="Generic Meeting" />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Start"
          rules={[
            {
              required: true,
              message: "Please define the meeting start time.",
            },
          ]}
        >
          <DatePicker
            showTime
            placeholder="Choose meeting start time"
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item label="Duration">
          <Input.Group>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "hour is required.",
                },
              ]}
              noStyle={true}
              name="duration-hour"
            >
              <Select
                style={{ width: "150px" }}
                placeholder="hour"
                options={hours}
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "minute is required.",
                },
              ]}
              noStyle={true}
              name="duration-minute"
            >
              <Select
                style={{ marginLeft: "16px", width: "150px" }}
                placeholder="minute"
                options={minutes}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item
          name="type"
          label="Meeting Type"
          rules={[
            { required: true, message: "Please define the meeting type." },
          ]}
        >
          <Select placeholder="Choose meeting type">
            <Select.Option disabled={true} value="0">
              Zoom Meeting
            </Select.Option>
            <Select.Option value="1">In-person Meeting</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    );
  };
  return (
    <Modal
      title={"Create a New Meeting"}
      visible={props.isVisible}
      destroyOnClose={true}
      className="no-select"
      forceRender={true}
      {...modalFooter}
      closable={false}
      centered={true}
    >
      {constructModal()}
    </Modal>
  );
};

export default CreateMeeting;
