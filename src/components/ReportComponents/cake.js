import React, { Component, memo } from 'react'

class Cake extends Component {
  componentDidMount() {
    var data = [{
      item: '事例一',
      count: 40,
      percent: 0.4
    }, {
      item: '事例二',
      count: 21,
      percent: 0.21
    }, {
      item: '事例三',
      count: 17,
      percent: 0.17
    }, {
      item: '事例四',
      count: 13,
      percent: 0.13
    }, {
      item: '事例五',
      count: 9,
      percent: 0.09
    }];
    window.$.getJSON('https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json', function (res) {
      // console.log(res,11);
      if (res) {
        // 如果接口返回数据 替换data  没有话走默认
        // data = res
      }
      var chart = new window.G2.Chart({
        container: 'mountNode',
        // forceFit: true,
        // height: window.innerHeight,
        // width:"100px"
        // width: "100%",
        // height: 500,
      });

      chart.source(data, {
        percent: {
          formatter: function formatter(val) {
            val = val * 100 + '%';
            return val;
          }
        }
      });
      chart.coord('theta', {
        radius: 0.75
      });
      chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      chart.intervalStack().position('percent').color('item').label('percent', {
        formatter: function formatter(val, item) {
          return item.point.item + ': ' + val;
        }
      }).tooltip('item*percent', function (item, percent) {
        percent = percent * 100 + '%';
        return {
          name: item,
          value: percent
        };
      }).style({
        lineWidth: 1,
        stroke: '#fff'
      });
      chart.render();
    })

  }
  render() {
    return (
      <div id="mountNode" style={{ width: "100%", height: "100%" }}></div>
    )
  }
}

export default memo(Cake)

