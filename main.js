const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    opacity: 0,
    width: 1500,
    height: 900,
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

ipcMain.on("educate-zoom", (event) => {
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
