import React from "react";
import "antd/dist/antd.css";
import error from "../imgs/sww.png";

export default class Fallback extends React.Component {
  componentDidMount() {
    document.getElementById("particles-js").style.display = "inline";
    window.dispatchEvent(new Event("resize"));
  }

  render() {
    return (
      <div
        className="no-select"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={error}
          draggable="false"
          style={{ width: "10%", filter: "invert(1)" }}
        />
        <div style={{ display: "inline", textAlign: "center" }}>
          <h1 style={{ fontSize: "3em", color: "white" }}>
            WE WILL BE BACK SHORTLY
          </h1>
          <h2 style={{ color: "aliceblue" }}>
            If you keep seeing this page, restarting the application might help.
          </h2>
        </div>
      </div>
    );
  }
}
