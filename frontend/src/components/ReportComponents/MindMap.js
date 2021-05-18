import G6 from "@antv/g6";
import "antd/dist/antd.css";
import reqwest from "reqwest";
import { TweenOneGroup } from "rc-tween-one";
import { PlusOutlined } from "@ant-design/icons";
import { withRouter, useHistory } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import {
  Tag,
  Row,
  Col,
  Card,
  Input,
  Slider,
  message,
  Divider,
  Skeleton,
  PageHeader,
} from "antd";
const { Util } = G6;

const MindMap = () => {
  const history = useHistory();
  const inputRef = useRef(null);
  const [mapRef, setMapRef] = useState();
  const [mapData, setMapData] = useState();
  const [keywords, setKeywords] = useState([]);
  const [title, setTitle] = useState("Loading...");
  const [newKeyword, setNewKeyword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [mapConfig, setMapConfig] = useState({
    "layer-size": 3,
    "layer-number": 2,
    "sentence-number": 1,
  });

  const mockData = {
    label: "Loading MindMap......",
    id: "0",
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

  const changeLayerSize = (value) => {
    setMapConfig({
      "layer-size": value,
      "layer-number": mapConfig["layer-number"],
      "sentence-number": mapConfig["sentence-number"],
    });

    reqwest({
      url: "https://3.131.58.107:8000/ppm/managedClient/account/mindmap/",
      type: "json",
      method: "POST",
      data: JSON.stringify({
        id: sessionStorage.getItem("targetMeetingID"),
        layerSize: value,
        layerNumber: mapConfig["layer-number"],
        sentenceNumber: mapConfig["sentence-number"],
        keywords: keywords,
      }),
      contentType: "application/json",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        setMapData(JSON.parse(res.output));
      },
      error: () => {
        message.error("Something went wrong while updating MindMap.");
      },
    });
  };

  const changeLayerNumber = (value) => {
    setMapConfig({
      "layer-size": mapConfig["layer-size"],
      "layer-number": value,
      "sentence-number": mapConfig["sentence-number"],
    });

    reqwest({
      url: "https://3.131.58.107:8000/ppm/managedClient/account/mindmap/",
      type: "json",
      method: "POST",
      data: JSON.stringify({
        id: sessionStorage.getItem("targetMeetingID"),
        layerSize: mapConfig["layer-size"],
        layerNumber: value,
        sentenceNumber: mapConfig["sentence-number"],
        keywords: keywords,
      }),
      contentType: "application/json",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        setMapData(JSON.parse(res.output));
      },
      error: () => {
        message.error("Something went wrong while updating MindMap.");
      },
    });
  };

  const changeSentenceSize = (value) => {
    setMapConfig({
      "layer-size": mapConfig["layer-size"],
      "layer-number": mapConfig["layer-number"],
      "sentence-number": value,
    });

    reqwest({
      url: "https://3.131.58.107:8000/ppm/managedClient/account/mindmap/",
      type: "json",
      method: "POST",
      data: JSON.stringify({
        id: sessionStorage.getItem("targetMeetingID"),
        layerSize: mapConfig["layer-size"],
        layerNumber: mapConfig["layer-number"],
        sentenceNumber: value,
        keywords: keywords,
      }),
      contentType: "application/json",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        setMapData(JSON.parse(res.output));
      },
      error: () => {
        message.error("Something went wrong while updating MindMap.");
      },
    });
  };

  useEffect(() => {
    setTitle(meetingID);
    const meetingID = sessionStorage.getItem("targetMeetingID");
    const graphContainer = document.getElementById("report-mindmap-container");

    let mindmap = new G6.TreeGraph({
      container: "report-mindmap-container",
      width: graphContainer.offsetWidth - 5,
      height: graphContainer.offsetHeight - 5,
      fitView: true,
      fitCenter: true,
      fitViewPadding: 32,
      modes: {
        default: ["drag-canvas", "zoom-canvas", "dice-mindmap"],
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
    setMapRef(mindmap);

    mindmap.data(dataTransform(mockData));
    mindmap.setMinZoom(0.48);
    mindmap.setMaxZoom(2);
    mindmap.render();
    window.addEventListener("resize", () =>
      mindmap.changeSize(
        graphContainer.offsetWidth - 5,
        graphContainer.offsetHeight - 5
      )
    );

    let mapReq = reqwest({
      url: "https://3.131.58.107:8000/ppm/managedClient/account/mindmap/",
      type: "json",
      method: "POST",
      data: JSON.stringify({
        id: meetingID,
        layerSize: mapConfig["layer-size"],
        layerNumber: mapConfig["layer-number"],
        sentenceNumber: mapConfig["sentence-number"],
        keywords: keywords,
      }),
      contentType: "application/json",
      headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
      success: (res) => {
        setMapData(JSON.parse(res.output));
      },
      error: () => {
        message.error("Something went wrong while fetching MindMap data.");
      },
    });

    return () => {
      mapReq.abort();
      sessionStorage.setItem("targetMeetingID", "");
    };
  }, []);

  useEffect(() => {
    if (mapData) {
      mapRef.changeData(dataTransform(mapData), false);
    }
  }, [mapData]);

  useEffect(() => {
    let editKeywordsReq;
    if (keywords.length != 0) {
      editKeywordsReq = reqwest({
        url: "https://3.131.58.107:8000/ppm/managedClient/account/mindmap/",
        type: "json",
        method: "POST",
        data: JSON.stringify({
          id: sessionStorage.getItem("targetMeetingID"),
          layerSize: mapConfig["layer-size"],
          layerNumber: mapConfig["layer-number"],
          sentenceNumber: mapConfig["sentence-number"],
          keywords: keywords,
        }),
        contentType: "application/json",
        headers: { "X-API-SESSION": sessionStorage.getItem("sessionKey") },
        success: (res) => {
          setMapData(JSON.parse(res.output));
        },
        error: () => {
          message.error("Something went wrong while updating MindMap.");
        },
      });
    }
    return () => {
      if (editKeywordsReq) {
        editKeywordsReq.abort();
      }
    };
  }, [keywords]);

  return (
    <div id="report-container">
      <PageHeader
        ghost={false}
        className="no-select"
        title="After Meeting Report"
        subTitle="viewing meeting MindMap"
        onBack={() => history.push("/appcontainer/meeting")}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Row
          style={{
            width: "100%",
            height: "80%",
            padding: "16px",
          }}
        >
          <Col span={18} style={{ height: "100%" }}>
            <div id="report-mindmap-container"></div>
          </Col>
          <Col span={6} style={{ height: "100%" }}>
            <Card className="no-select" id="report-config-card" title={title}>
              <Skeleton active={true} loading={loadingConfig}>
                <p>Layer Size</p>
                <Slider
                  defaultValue={mapConfig["layer-size"]}
                  min={2}
                  max={5}
                  onAfterChange={changeLayerSize}
                />
                <p>Layer Number</p>
                <Slider
                  defaultValue={mapConfig["layer-number"]}
                  min={2}
                  max={5}
                  onAfterChange={changeLayerNumber}
                />
                <p>Sentence Number</p>
                <Slider
                  defaultValue={mapConfig["sentence-number"]}
                  min={1}
                  max={3}
                  onAfterChange={changeSentenceSize}
                />
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
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default withRouter(MindMap);
