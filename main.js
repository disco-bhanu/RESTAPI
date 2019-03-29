const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const app1 = require('./dist/server');
let win;

function createWindow() {

  console.log(app1);
  win = new BrowserWindow({ width: 800, height: 600, webPreferences: {webSecurity: false} });

  // load the dist folder from Angular
  /*win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/browser/index.html`),
      protocol: "file:",
      slashes: true
    })
  );*/

  win.loadURL(`file://${__dirname}/dist/browser/index.html`)

  win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });
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
