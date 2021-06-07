/**
 * electron 主文件
 */
import dotenv from 'dotenv';
import { app, BrowserWindow, ipcMain } from 'electron';
import is_dev from 'electron-is-dev';
// @ts-ignore
import Store from 'electron-store';
import { join } from 'path';

const store = new Store();
// @ts-ignore
ipcMain.on('store:set', async (e, args) => {
  store.set(args.key, args.value);
});
// @ts-ignore
ipcMain.handle('store:get', async (e, args) => {
  return await store.get(args);
});
// @ts-ignore
ipcMain.on('store:delete', async (e, args) => {
  store.delete(args);
});

dotenv.config({ path: join(__dirname, '../../.env') });

let win = null;

class createWin {
  // 创建浏览器窗口
  constructor() {
    // @ts-ignore
    win = new BrowserWindow({
      width: 930,
      height: 700,
      frame: false,
      transparent: true,
      webPreferences: {
        devTools: true,

        nodeIntegration: true,
        enableRemoteModule: true,
      },
    });
    // win.webContents.openDevTools()
    // @ts-ignore
    win.maximize();
    // win.maximize()

    const URL = is_dev
      ? `http://localhost:${process.env.PORT}` // vite 启动的服务器地址
      : `file://${join(__dirname, '../../dist/render/index.html')}`; // vite 构建后的静态文件地址

    // @ts-ignore
    win.loadURL(URL);
  }
}

app.whenReady().then(() => new createWin());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    new createWin();
  }
});
