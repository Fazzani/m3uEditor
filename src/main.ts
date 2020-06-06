import { app, BrowserWindow, ipcMain, IpcMainEvent, Menu, dialog, ipcRenderer } from 'electron';
import { is } from 'electron-util';
import os from 'os';

declare var MAIN_WINDOW_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      // preload: __dirname + '/preload.js',
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  if (is.development) {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  const showMessage = (msg: String) =>
    dialog.showMessageBox({
      type: 'info',
      message: `You activated action: "${msg}"`,
      buttons: ['Close'],
    });

  const menu = Menu.buildFromTemplate([
    {
      label: 'Preferences',
      submenu: [
        {
          label: 'Prefer Dark Theme',
          type: 'checkbox',
        },
        {
          label: 'Hide Titlebar when maximized',
          type: 'checkbox',
        },
        {
          label: 'Color',
          submenu: [
            {
              label: 'Red',
              type: 'radio',
              accelerator: 'CmdOrCtrl+R',
              click: () => showMessage('Red'),
            },
            {
              label: 'Green',
              type: 'radio',
              accelerator: 'CmdOrCtrl+G',
              click: () => showMessage('Green'),
            },
            {
              label: 'Blue',
              type: 'radio',
              accelerator: 'CmdOrCtrl+B',
              click: () => showMessage('Blue'),
            },
          ],
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => ipcMain.emit("open-file-dialog-for-file"),
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          accelerator: 'CmdOrCtrl+A',
          click: () =>
            dialog.showMessageBox({
              type: 'info',
              title: 'about',
              message: `GTK+ Code Demos
                        3.22.30
                        Running against GTK+ 3.22.30
                        Program to demonstrate GTK+ functions.
                        (C) 1997-2013 The GTK+ Team
                        This program comes with absolutely no warranty.
                        See the GNU Lesser General Public License,
                        version 2.1 or later for details.`,
              buttons: ['Close'],
            }),
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
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
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('runCommandEvent', (e: IpcMainEvent, cmd) => {
  e.preventDefault();
  console.log(cmd);
  e.returnValue = 'received';
});

ipcMain.on('open-file-dialog-for-file', function (event) {
  let win = new BrowserWindow({ width: 800, height: 600 });

  let options: Electron.OpenDialogOptions = {
    title: 'Open playlist',
    // // See place holder 2 in above image
    // defaultPath: 'D:\\electron-app',
    buttonLabel: 'Open',
    filters: [
      { name: 'Playlists', extensions: ['m3u'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  };

  if (os.platform() === 'linux' || os.platform() === 'win32') {
    dialog.showOpenDialog(win, options).then((files) => {
      if (files) mainWindow.webContents.send('selected-file', {fileLocation: files.filePaths[0]});
      win.close();
      // if (files) event.sender.send('selected-file', files.filePaths[0]);
    });
  } else {
    dialog.showOpenDialog(win, options).then((files) => {
      if (files) mainWindow.webContents.send('selected-file', {fileLocation: files.filePaths[0]});
      win.close();
      // if (files) event.sender.send('selected-file', files.filePaths[0]);
    });
  }
});
