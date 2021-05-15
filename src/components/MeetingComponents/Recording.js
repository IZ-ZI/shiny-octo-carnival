import React, { Component } from 'react'
import { Modal, Button, Steps } from 'antd';
import 'antd/dist/antd.css';
// import recorder from "./recorder"
const { Step } = Steps;



export default class AudioPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      mediaRecorder: {},
      musicState:0,  //0,1,2
    };
  }

  componentDidMount() {
    var promise = navigator.mediaDevices.getUserMedia({
      audio: true,
      // video: { width: 1280, height: 720 }
    });

    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      navigator.mediaDevices.getUserMedia(constraints).then(
        stream => {
          console.log("授权成功！");
          // var mediaRecorder = new MediaRecorder(stream);

          const mediaRecorder = new MediaRecorder(stream);
          this.setState({
            mediaRecorder: mediaRecorder
          })
          // recordBtn.onclick = () => {
          //   mediaRecorder.start();
          //   mediaRecorder.stop();
          //
          //   console.log("录音中...");
          // };

          //会议结束调用下面方法收集chunks音频流传给后端
          // var chunks = [];
          // mediaRecorder.ondataavailable = function (e) {
          //   chunks.push(e.data);
          // };
          // mediaRecorder.onstop = e => {
          //   console.log("暂停播放")
          //   var blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          //   console.log(blob, "blob")
          //   var audio = document.querySelector(".audio-player");
          //   chunks = [];
          //   // 
          //   // arrybuffer_voice_send_recv_play(blob)
          //   // console.log(111)
          //   var audioURL = window.URL.createObjectURL(blob);
          //   console.log(audioURL, "audioURL")
          //   audio.src = audioURL;
          // };
        },
        () => {
          console.error("授权失败！");
        }
      );
    } else {
      console.error("浏览器不支持 getUserMedia");
    }
  }

  showModal = () => {
    this.setState({
      isModalVisible: true
    })
  }
  handleCancel = () => {
    this.setState({
      isModalVisible: false
    })
  }
  handleOk = () => {
    this.setState({
      isModalVisible: false,
      musicState:1
    })
    // 录音开始调用这个方法
    // this.state.mediaRecorder.start();

    // 录音终止调用mediaRecorder.stop();
  }

  handleNo = () => {
    this.setState({
      isModalVisible: false
    })
  }
  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          meeting
        </Button>
        <Modal
          title="Basic Modal"
          visible={this.state.isModalVisible}
          // onOk={this.handleOk.bind(this)}
          // onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="btn2" onClick={this.handleCancel.bind(this)}>
              关闭
              </Button>,
            <Button key="btn3" onClick={this.handleNo.bind(this)}>
              否
              </Button>,
            <Button key="btn4" type="primary" onClick={this.handleOk.bind(this)}>
              是
             </Button>
          ]}
        >
          准备去录音吗
        </Modal>
        <Steps current={this.state.musicState}>
          <Step title="开始录音" />
          <Step title="录音中"/>
          <Step title="录音结束"/>
        </Steps>
      </div>
    )
  }
}
