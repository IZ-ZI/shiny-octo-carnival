import React, { useState, useEffect, useRef } from "react";
import G6 from "@antv/g6";
import "antd/dist/antd.css";
import { TweenOneGroup } from "rc-tween-one";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader, Card, Slider, Divider, Skeleton, Tag, Input } from "antd";
const { Util } = G6;

const MindMap = ({ data }) => {
  const inputRef = useRef(null);
  const [keywords, setKeywords] = useState([
    "Classification",
    "Machine Learning",
    "Ant Design",
    "Other words",
  ]);
  const [title, setTitle] = useState("Loading...");
  const [isEditing, setIsEditing] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [loadingConfig, setLoadingConfig] = useState(false);

  data = {
    label: "Modeling Methods",
    id: "0",
    children: [
      {
        label: "Classification",
        id: "0-1",
        color: "#5AD8A6",
        children: [
          {
            label: "Logistic regression",
            id: "0-1-1",
          },
          {
            label: "Linear discriminant analysis",
            id: "0-1-2",
          },
          {
            label: "Rules",
            id: "0-1-3",
          },
          {
            label: "Decision trees",
            id: "0-1-4",
          },
          {
            label: "Naive Bayes",
            id: "0-1-5",
          },
          {
            label: "K nearest neighbor",
            id: "0-1-6",
          },
          {
            label: "Probabilistic neural network",
            id: "0-1-7",
          },
          {
            label: "Support vector machine",
            id: "0-1-8",
          },
        ],
      },
      {
        label: "Consensus",
        id: "0-2",
        color: "#F6BD16",
        children: [
          {
            label: "Models diversity",
            id: "0-2-1",
            children: [
              {
                label: "Different initializations",
                id: "0-2-1-1",
              },
              {
                label: "Different parameter choices",
                id: "0-2-1-2",
              },
              {
                label: "Different architectures",
                id: "0-2-1-3",
              },
              {
                label: "Different modeling methods",
                id: "0-2-1-4",
              },
              {
                label: "Different training sets",
                id: "0-2-1-5",
              },
              {
                label: "Different feature sets",
                id: "0-2-1-6",
              },
            ],
          },
          {
            label: "Methods",
            id: "0-2-2",
            children: [
              {
                label: "Classifier selection",
                id: "0-2-2-1",
              },
              {
                label: "Classifier fusion",
                id: "0-2-2-2",
              },
            ],
          },
          {
            label: "Common",
            id: "0-2-3",
            children: [
              {
                label: "Bagging",
                id: "0-2-3-1",
              },
              {
                label: "Boosting",
                id: "0-2-3-2",
              },
              {
                label: "AdaBoost",
                id: "0-2-3-3",
              },
            ],
          },
        ],
      },
      {
        label: "Regression",
        id: "0-3",
        color: "#269A99",
        children: [
          {
            label: "Multiple linear regression",
            id: "0-3-1",
          },
          {
            label: "Partial least squares",
            id: "0-3-2",
          },
          {
            label: "Multi-layer feedforward neural network",
            id: "0-3-3",
          },
          {
            label: "General regression neural network",
            id: "0-3-4",
          },
          {
            label: "Support vector regression",
            id: "0-3-5",
          },
        ],
      },
    ],
  };

  G6.registerNode(
    "dice-mind-map-root",
    {
      jsx: (cfg) => {
        const width = Util.getTextSize(cfg.label, 16)[0] + 24;
        const stroke = cfg.style.stroke || "#096dd9";
        const fill = "#263859";

        return `
      <group>
        <rect draggable="true" style={{width: ${width}, height: 42, stroke: ${stroke}, fill: ${fill}, radius: 16}} keyshape>
          <text style={{ fill: #ffffff, fontSize: 16, marginLeft: 12, marginTop: 12 }}>${
            cfg.label
          }</text>
          <text style={{ marginLeft: ${
            width - 16
          }, marginTop: -20, stroke: '#66ccff', fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        } }} action="add">+</text>
        </rect>
      </group>
    `;
      },
      getAnchorPoints() {
        return [
          [0, 0.5],
          [1, 0.5],
        ];
      },
    },
    "single-node"
  );

  G6.registerNode(
    "dice-mind-map-mid",
    {
      jsx: (cfg) => {
        const width = Util.getTextSize(cfg.label, 14)[0] + 24;
        const color = cfg.color || cfg.style.stroke;

        return `
      <group>
        <rect draggable="true" style={{width: ${
          width + 24
        }, height: 22}} keyshape>
          <text draggable="true" style={{ fontSize: 14, marginLeft: 12, marginTop: 6 }}>${
            cfg.label
          }</text>
          <text style={{ marginLeft: ${
            width - 8
          }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        }, next: 'inline' }} action="add">+</text>
          <text style={{ marginLeft: ${
            width - 4
          }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        }, next: 'inline' }} action="delete">-</text>
        </rect>
        <rect style={{ fill: ${color}, width: ${
          width + 24
        }, height: 2, x: 0, y: 22 }} />
        
      </group>
    `;
      },
      getAnchorPoints() {
        return [
          [0, 0.965],
          [1, 0.965],
        ];
      },
    },
    "single-node"
  );

  G6.registerNode(
    "dice-mind-map-leaf",
    {
      jsx: (cfg) => {
        const width = Util.getTextSize(cfg.label, 12)[0] + 24;
        const color = cfg.color || cfg.style.stroke;

        return `
      <group>
        <rect draggable="true" style={{width: ${
          width + 20
        }, height: 26, fill: 'transparent' }}>
          <text style={{ fontSize: 12, marginLeft: 12, marginTop: 6 }}>${
            cfg.label
          }</text>
              <text style={{ marginLeft: ${
                width - 8
              }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        }, next: 'inline' }} action="add">+</text>
              <text style={{ marginLeft: ${
                width - 4
              }, marginTop: -10, stroke: ${color}, fill: '#000', cursor: 'pointer', opacity: ${
          cfg.hover ? 0.75 : 0
        }, next: 'inline' }} action="delete">-</text>
        </rect>
        <rect style={{ fill: ${color}, width: ${
          width + 24
        }, height: 2, x: 0, y: 32 }} />
        
      </group>
    `;
      },
      getAnchorPoints() {
        return [
          [0, 0.965],
          [1, 0.965],
        ];
      },
    },
    "single-node"
  );

  const dataTransform = (data) => {
    const changeData = (d, level = 0, color) => {
      const data = {
        ...d,
      };
      switch (level) {
        case 0:
          data.type = "dice-mind-map-root";
          break;
        case 1:
          data.type = "dice-mind-map-mid";
          break;
        default:
          data.type = "dice-mind-map-leaf";
          break;
      }

      data.hover = false;

      if (color) {
        data.color = color;
      }

      if (level === 1 && !d.direction) {
        if (!d.direction) {
          data.direction =
            d.id.charCodeAt(d.id.length - 1) % 2 === 0 ? "right" : "left";
        }
      }

      if (d.children) {
        data.children = d.children.map((child) =>
          changeData(child, level + 1, data.color)
        );
      }
      return data;
    };
    return changeData(data);
  };

  const removeKeyword = (keywordToRemove) => {
    const updateKeywordList = keywords.filter(
      (keyword) => keyword !== keywordToRemove
    );
    setKeywords(updateKeywordList);
  };

  const generateTag = (tag) => {
    const tagComponent = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          removeKeyword(tag);
        }}
        style={{ margin: "2px" }}
        className="no-select"
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: "inline-block" }}>
        {tagComponent}
      </span>
    );
  };

  const toggleInput = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current.focus(), 100);
  };

  const onInputChange = (e) => {
    setNewKeyword(e.target.value);
  };

  const onInputConfirm = () => {
    let list = [...keywords];
    if (newKeyword && keywords.indexOf(newKeyword) === -1) {
      list = [...keywords, newKeyword];
    }
    setKeywords(list);
    setIsEditing(false);
    setNewKeyword("");
  };

  useEffect(() => {
    const graphContainer = document.getElementById("report-mindmap-container");
    var mindmap = new G6.TreeGraph({
      container: "report-mindmap-container",
      width: graphContainer.offsetWidth - 5,
      height: graphContainer.offsetHeight - 5,
      fitView: true,
      fitCenter: true,
      fitViewPadding: 32,
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
          "dice-mindmap",
        ],
      },
      defaultEdge: {
        shape: "cubic-horizontal",
        style: {
          stroke: "#A3B1BF",
        },
      },
      layout: {
        type: "mindmap",
        direction: "H",
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: (node) => {
          return node.level === 0
            ? Util.getTextSize(node.label, 16)[0] + 12
            : Util.getTextSize(node.label, 12)[0];
        },
        getVGap: function getVGap() {
          return 10;
        },
        getHGap: function getHGap() {
          return 60;
        },
        getSide: (node) => {
          return node.data.direction;
        },
      },
    });

    mindmap.data(dataTransform(data));
    mindmap.setMinZoom(0.48);
    mindmap.setMaxZoom(2);
    mindmap.render();
    window.addEventListener("resize", () =>
      mindmap.changeSize(
        graphContainer.offsetWidth - 5,
        graphContainer.offsetHeight - 5
      )
    );
  }, []);

  return (
    <div id="report-container">
      <PageHeader
        ghost={false}
        className="no-select"
        title="After Meeting Report"
        subTitle="viewing meeting MindMap"
        onBack={() => window.history.back()}
      />
      <div id="report-mindmap-container"></div>
      <Card id="report-config-card" title={title}>
        <Skeleton active={true} loading={loadingConfig}>
          <p>Layer Size</p>
          <Slider min={2} max={5} />
          <p>Layer Number</p>
          <Slider min={2} max={5} />
          <p>Sentence Number</p>
          <Slider min={1} max={3} />
        </Skeleton>
        <Divider />
        <p>Edit Keywords to Tune the MindMap</p>
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: "from",
            duration: 100,
            onComplete: (e) => {
              e.target.style = "";
            },
          }}
          leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
          appear={false}
        >
          {keywords.map(generateTag)}
        </TweenOneGroup>
        {isEditing && (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{ width: 78, marginTop: "16px" }}
            value={newKeyword}
            onChange={onInputChange}
            onBlur={onInputConfirm}
            onPressEnter={onInputConfirm}
          />
        )}
        {!isEditing && (
          <Tag
            onClick={toggleInput}
            className="no-select"
            style={{
              marginTop: "16px",
              background: "transparent",
              borderStyle: "dashed",
            }}
          >
            <PlusOutlined /> New Keyword
          </Tag>
        )}
      </Card>
    </div>
  );
};

export default MindMap;
