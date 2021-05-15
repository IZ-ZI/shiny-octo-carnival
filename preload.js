const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (event, payload) => {
    let whiteListEvents = [
      "save-login",
      "try-login",
      "educate-zoom",
      "connect-zoom",
      "should-update-meeting",
    ];
    if (whiteListEvents.includes(event)) {
      ipcRenderer.send(event, payload);
    }
  },
  receive: (event, func) => {
    let whiteListEvents = ["update-meeting-now"];
    if (whiteListEvents.includes(event)) {
      ipcRenderer.on(event, (e, ...args) => func(...args));
    }
  },
  removeListener: (channel, func) => {
    let whiteListEvents = ["update-meeting-now"];
    if (whiteListEvents.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  },
});
