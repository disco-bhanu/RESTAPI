const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const server = require('./server');
let win;

function createWindow() {

  win = new BrowserWindow({
    show: false,
    title: 'RESTAPI',
    width: 1400,
    height: 900,
    backgroundColor: '#303030',
    webPreferences: {webSecurity: false}
  });

  win.loadURL(`file://${__dirname}/dist/RESTAPI/index.html`)

  //win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show()
  })
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
