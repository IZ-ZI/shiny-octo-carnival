import React, { useEffect } from "react";
import { Chart } from "@antv/g2";

let sortDate = (x, y) => {
  return new Date(x.Date).getTime() - new Date(y.Date).getTime();
};

export default function Dashboard_SevenDayGraph({ data }) {
  useEffect(() => {
    let chart = new Chart({
      container: "dashboard-bar-mount",
      autoFit: true,
    });

    if (!Array.isArray(data)) {
      data = [JSON.parse(data)].flat();
    }

    chart.data(data.sort(sortDate));
    chart.tooltip({
      showMarkers: false,
    });
    chart.interval().position("Date*Number of Meetings");
    chart.interaction("element-active");
    chart.render();
  }, []);

  return <div id="dashboard-bar-mount"></div>;
}
