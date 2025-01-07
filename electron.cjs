const { app, BrowserWindow } = require('electron');
const path = require('path');

// var HID = require('node-hid');


function createWindow() {


// // 列出所有可用的 HID 设备
// HID.list((err, devices) => {
//   if (err) throw err;
//   console.log('Available HID devices:########', devices);
// });

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:5666' // 开发环境地址
      : `file://${path.join(__dirname, './dist/index.html')}`, // 生产环境地址
  );

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
