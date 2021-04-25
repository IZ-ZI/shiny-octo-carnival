import React from 'react';
import reqwest from 'reqwest';

import "antd/dist/antd.css";
import { Avatar, Button, Skeleton, List } from 'antd';

const numOfItems = 10;
const mockURI = `https://randomuser.me/api/?results=${numOfItems}&inc=name,gender,email,location,picture`;

class LoadMoreContent extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };

  componentDidMount() {
    reqwest({
      url: 'https://randomuser.me/api/?results=1&inc=name,gender,email,location,picture',
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        this.setState({
          initLoading: false,
          data: res.results,
          list: res.results,
        });
      },
    });
  }

  getData = callback => {
    reqwest({
      url: mockURI,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };

  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(numOfItems)].map(() => ({ loading: true, name: {} }))),
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
          var objDiv = document.getElementById("bottom");
          objDiv.scrollIntoView({ behavior: "smooth" });
        },
      );
    });
  };

  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            marginBottom: 42,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>Fetch Content</Button>
        </div>
      ) : null;

    return (
      <List
        loading={initLoading}
        itemLayout="vertical"
        loadMore={loadMore}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Skeleton avatar title={true} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.picture === undefined ? '' : `${item.picture.thumbnail}`} />}
                title={<a href="https://github.com/IZ-ZI/shiny-octo-carnival">{item.name.first + ' ' + item.name.last}</a>}
                description={item.email}
              />
              {(item.gender === 'female' ? 'She' : 'He') + ' is living at ' + (item.location === undefined ? '' : (item.location.street.number + ' ' + item.location.street.name + ', ' + item.location.country))}
            </Skeleton>
          </List.Item>
        )}
      />
    );
  }
}

export default LoadMoreContent;
