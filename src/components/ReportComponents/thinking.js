import React, { Component, memo } from "react";
import { Slider, Switch } from "antd";
import "antd/dist/antd.css";

class Thinking extends Component {
  componentDidMount() {
    window.$.getJSON(
      "https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json",
      function (data) {
        const thinking = document.querySelector("#thinking");

        var graph = new window.G6.TreeGraph({
          container: "thinking",
          width: thinking.offsetWidth,
          height: thinking.offsetHeight,
          // width: "100%",
          // height: "100%",
          // pixelRatio: 2,
          modes: {
            default: [
              {
                type: "collapse-expand",
                onChange: function onChange(item, collapsed) {
                  var data = item.get("model").data;
                  data.collapsed = collapsed;
                  return true;
                },
              },
              "drag-canvas",
              "zoom-canvas",
            ],
          },
          defaultNode: {
            size: 16,
            anchorPoints: [
              [0, 0.5],
              [1, 0.5],
            ],
            style: {
              fill: "#40a9ff",
              stroke: "#096dd9",
            },
          },
          defaultEdge: {
            shape: "cubic-horizontal",
            style: {
              stroke: "#A3B1BF",
            },
          },
          layout: {
            type: "compactBox",
            direction: "LR",
            getId: function getId(d) {
              return d.id;
            },
            getHeight: function getHeight() {
              return 16;
            },
            getWidth: function getWidth() {
              return 16;
            },
            getVGap: function getVGap() {
              return 10;
            },
            getHGap: function getHGap() {
              return 100;
            },
          },
        });

        graph.node(function (node) {
          return {
            size: 26,
            style: {
              fill: "#40a9ff",
              stroke: "#096dd9",
            },
            label: node.id,
            labelCfg: {
              position:
                node.children && node.children.length > 0 ? "left" : "right",
            },
          };
        });

        graph.data(data);
        graph.render();
        graph.fitView();
      }
    );
  }

  handChange1 = () => {};
  handChange2 = () => {};
  handChange3 = () => {};

  render() {
    return (
      <>
        <div id="thinking" style={{ width: "700px", height: "500px" }}></div>
        <div className="flex">
          layer size:{" "}
          <div className="slider">
            <Slider
              onChange={this.handChange1.bind(this)}
              defaultValue={1}
              max={5}
            />
          </div>
        </div>
        <div className="flex">
          layer width:{" "}
          <div className="slider">
            <Slider
              onChange={this.handChange2.bind(this)}
              defaultValue={1}
              max={5}
            />
          </div>
        </div>
        <div className="flex">
          sentence number:{" "}
          <div className="slider">
            <Slider
              onChange={this.handChange3.bind(this)}
              defaultValue={1}
              max={5}
            />
          </div>
        </div>
      </>
    );
  }
}

export default memo(Thinking);

