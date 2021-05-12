import React, { Component } from "react";

import { withRouter } from "react-router-dom";

// import * as G2 from '@antv/g2';
import Thinking from "./thinking";
//import Cake from "./cake";
//import "./index.css"
import { Tabs, Input, Button, Tag } from "antd";
import "antd/dist/antd.css";

const { TabPane } = Tabs;

class BannerChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      tagList: [],
    };
  }
  callback = () => {};
  handBack = () => {
    window.history.back();
  };
  handClick = () => {
    // 替换成了自己url
    window.$.post("", { data: this.value }, function (data) {
      console.log(data);
    });
  };

  handChange = (e) => {
    this.setState({
      value: e,
    });
    this.setState({
      tagList: e.split(";"),
    });
  };

  //删除tag
  onTagClose = (index) => {
    const arr = JSON.parse(JSON.stringify(this.state.tagList));
    arr.split(index, 1);
    this.setState({
      tagList: arr,
    });
  };

  remove = () => {
    this.setState({
      tagList: [],
      value: "",
    });
  };
  render() {
    return (
      <div className="box">
        <button onClick={this.handBack}>返回</button>
        <Tabs defaultActiveKey="2" onChange={this.callback}>
          {/*<TabPane tab="Tab 1" key="1">
            <div style={{ width: "700px", height: "500px" }}>
              <Cake />
            </div>
          </TabPane>*/}
          <TabPane tab="Tab 2" key="2">
            <div>
              <Thinking />
            </div>
          </TabPane>
        </Tabs>

        {this.state.tagList.map((el, index) => (
          <Tag closable onClose={this.onTagClose.bind(this, index)}>
            {el}
          </Tag>
        ))}

        <Button onClick={this.remove.bind(this)}>一键清空tag</Button>

        <Input
          placeholder="请输入关键词"
          value={this.state.value}
          onChange={this.handChange.bind(this)}
          placeholder="Basic usage"
        />
        <Button onClick={this.handClick}>上传list</Button>
      </div>
    );
  }
}

//export default withRouter(BannerChart);
export default BannerChart;
