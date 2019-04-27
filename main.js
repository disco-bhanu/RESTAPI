const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const server = require('../server');
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

  win.webContents.openDevTools()

  win.on("closed", () => {
    win = null;
  });

  win.once('ready-to-show', () => {
    win.show()
  });

  const template = [{
    label: "Application",
    submenu: [
      { label: "About Application", selector: "REST API" },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
      { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
      { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
      { type: "separator" },
      { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
      { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
      { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
      { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  ipcMain.on('test', (e) => {
    win.webContents.send('tested', 'hello')
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
