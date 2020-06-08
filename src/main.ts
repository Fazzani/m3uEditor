import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import { is } from 'electron-util';
import { menu } from './native-ui/all';

require('update-electron-app')({
  logger: require('electron-log'),
});

declare var MAIN_WINDOW_WEBPACK_ENTRY: any;
declare global {
  var __MAIN_WINDOW__: BrowserWindow | null;
}

if (process.mas) app.setName(`M3u App (${process.env.npm_package_version})`);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

console.log(app.getPath('userData'));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

function initialize() {
  makeSingleInstance();
  const createWindow = () => {
    // Create the browser window.
    global.__MAIN_WINDOW__ = new BrowserWindow({
      width: 1080,
      minWidth: 680,
      height: 840,
      title: app.getName(),
      webPreferences: {
        nodeIntegration: true,
        // preload: __dirname + '/preload.js',
      },
    });

    // and load the index.html of the app.
    global.__MAIN_WINDOW__.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    if (is.development) {
      global.__MAIN_WINDOW__.webContents.openDevTools();
      global.__MAIN_WINDOW__.maximize();
    }

    // Emitted when the window is closed.
    global.__MAIN_WINDOW__.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      __MAIN_WINDOW__ = null;
    });

    Menu.setApplicationMenu(menu);
    ipcMain.emit('put-in-tray');
  };

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (global.__MAIN_WINDOW__ === null) {
      createWindow();
    }
  });

  // Make this app a single instance app.
  //
  // The main window will be restored and focused instead of a second window
  // opened when a person attempts to launch a second instance.
  //
  // Returns true if the current version of the app should quit instead of
  // launching.
  function makeSingleInstance() {
    if (process.mas) return;

    app.requestSingleInstanceLock();

    app.on('second-instance', () => {
      if (global.__MAIN_WINDOW__) {
        if (global.__MAIN_WINDOW__.isMinimized()) global.__MAIN_WINDOW__.restore();
        global.__MAIN_WINDOW__.focus();
      }
    });
  }
}

initialize();
