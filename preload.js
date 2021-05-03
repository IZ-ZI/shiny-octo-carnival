const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (event, payload) => {
    let whiteListEvents = [
      "save-login",
      "try-login",
      "try-register",
      "educate-zoom",
    ];
    if (whiteListEvents.includes(event)) {
      ipcRenderer.send(event, payload);
    }
  },
  receive: (event, func) => {
    let whiteListEvents = ["default-e"];
    if (whiteListEvents.includes(event)) {
      ipcRenderer.on(event, (e, ...args) => func(...args));
    }
  },
});
