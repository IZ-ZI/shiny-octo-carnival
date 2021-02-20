import React from 'react';
import ReactDom from 'react-dom';
import {Button, Alert} from 'antd';
import "antd/dist/antd.css";

export default function App() {
    return(
        <Button type="primary" onClick={welcome}>
            Click Me!
        </Button>
    )
}

function welcome() {
    console.log("Welcome");
    ReactDom.render(<Alert message="Hello Group Fifteen!" description="Welcome to your 395 Project!" type="success" banner closable afterClose={removeAlert}/>, document.getElementById('alert'));
}

function removeAlert() {
    ReactDom.unmountComponentAtNode(document.getElementById('alert'));
}