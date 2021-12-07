const {app, BrowserWindow} = require("electron")

function createWindow () {
  let win = new BrowserWindow({
    width: 1440,
    height: 960,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: false
    }
  });

  win.removeMenu();
  win.setMinimizable(false);
  win.loadFile("release.html");
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function() {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0)
    createWindow();
});
