import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  Menu,
  shell,
} from 'electron';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '../..');

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, '../preload/preload.mjs');
const indexHtml = path.join(RENDERER_DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    autoHideMenuBar: true,
    frame: false,
    height: 900,
    icon: path.join(process.env.VITE_PUBLIC as string, 'favicon.ico'),
    movable: true,
    show: false,
    title: 'Main window',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload,
      webSecurity: true,
    },
    width: 1440,
  });

  // 监听窗口准备好显示的事件
  win.once('ready-to-show', () => {
    win?.maximize(); // 最大化窗口
    win?.show(); // 显示窗口
  });

  win.on('maximize', () => {
    win?.webContents.send('maximize-changed', true);
  });

  win.on('unmaximize', () => {
    win?.webContents.send('maximize-changed', false);
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}
Menu.setApplicationMenu(null);
app
  .whenReady()
  .then(createWindow)
  .then(() => {
    // 禁用了菜单之后，默认的快捷键也会被禁用，这里重新注册部分常用快捷键
    if (VITE_DEV_SERVER_URL) {
      // 开发模式下监听快捷键来打开开发者工具
      globalShortcut.register('CmdOrCtrl+Shift+I', () => {
        BrowserWindow.getFocusedWindow()?.webContents.toggleDevTools();
      });
    }
    // 监听快捷键来刷新页面
    globalShortcut.registerAll(['CmdOrCtrl+R', 'CmdOrCtrl+F5'], () => {
      BrowserWindow.getFocusedWindow()?.webContents.reload();
    });
    // 监听快捷键来强制刷新页面
    globalShortcut.registerAll(
      ['CmdOrCtrl+Shift+R', 'CmdOrCtrl+Shift+F5'],
      () => {
        BrowserWindow.getFocusedWindow()?.webContents.reloadIgnoringCache();
      },
    );
  });

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length > 0) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    frame: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload,
      webviewTag: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.handle('app-minimize', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  if (browserWindow) {
    browserWindow.minimize();
  }
});

ipcMain.handle('app-maximize', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  if (browserWindow) {
    if (browserWindow.isMaximized()) {
      browserWindow.restore();
    } else {
      browserWindow.maximize();
    }
  }
});

ipcMain.handle('app-close', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  if (browserWindow) {
    browserWindow.close();
  }
});

ipcMain.handle('is-maximized', (event) => {
  const browserWindow = BrowserWindow.fromWebContents(event.sender);
  if (browserWindow) {
    return browserWindow.isMaximized();
  }
  return false;
});
