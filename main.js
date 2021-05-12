const path = require("path");
const {
  screen,
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  net,
} = require("electron");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const mainWindow = new BrowserWindow({
    show: false,
    opacity: 0,
    width: parseInt(width * 0.7),
    height: parseInt(height * 0.75),
    minWidth: parseInt(width * 0.5),
    minHeight: parseInt(height * 0.55),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // mainWindow.removeMenu();
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    let totalSteps = 100.0;
    let totalTime = 500.0;

    let currentOpacity = mainWindow.getOpacity();

    let timerID = setInterval(() => {
      currentOpacity = currentOpacity + 1.0 / totalSteps;
      mainWindow.setOpacity(currentOpacity);
      if (currentOpacity > 1.0) {
        clearInterval(timerID);
      }
    }, totalTime / totalSteps);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);
app.commandLine.appendSwitch("ignore-certificate-errors", "true");
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("save-login", (event, arg) => {
  const options = {
    type: "info",
    buttons: ["OK"],
    defaultId: 1,
    title: "Info",
    message: "Received Log In Attempt",
    detail: arg.toString(),
  };
  dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(), options);
});

ipcMain.on("educate-zoom", () => {
  const options = {
    type: "warning",
    buttons: ["Cancel", "Proceed"],
    defaultID: 0,
    cancelID: 0,
    title: "Attention",
    message: "You are able to open an external website in the browser.",
  };
  let res = dialog.showMessageBoxSync(
    BrowserWindow.getFocusedWindow(),
    options
  );
  if (res === 1) {
    require("electron").shell.openExternal(
      "https://marketplace.zoom.us/docs/guides/auth/oauth"
    );
  }
});

ipcMain.on("connect-zoom", (event, payload) => {
  const oauthURL =
    "https://zoom.us/oauth/authorize?response_type=code&client_id=ZkN5imdcTRaz0LJJ1dtMhw&redirect_uri=https://18.221.119.146:8000/oum/argusUtils/setup/redirected";

  const sizes = BrowserWindow.getFocusedWindow().getSize();
  var authWindow = new BrowserWindow({
    modal: true,
    show: false,
    width: parseInt(sizes[0] * 0.6),
    height: parseInt(sizes[1] * 0.6),
    parent: BrowserWindow.getFocusedWindow(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  authWindow.removeMenu();
  authWindow.loadURL(oauthURL);
  authWindow.show();
  authWindow.webContents.on("will-navigate", function (event, newUrl) {
    let re = /code=(.*)/;
    let code = newUrl.toString().match(re);
    if (code) {
      const req = net.request({
        method: "GET",
        url:
          "https://18.221.119.146:8000/oum/argusUtils/zoomlinker?code=" +
          code[1],
      });
      req.setHeader("X-API-SESSION", payload);
      req.end();
      authWindow.close();
    }
  });

  authWindow.on("closed", function () {
    authWindow = null;
  });
});

ipcMain.on("should-update-meeting", (event, payload) => {
  BrowserWindow.getFocusedWindow().webContents.send("update-meeting-now");
});
