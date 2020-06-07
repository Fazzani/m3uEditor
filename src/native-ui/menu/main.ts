import { Menu, dialog, ipcMain } from 'electron';

export const showMessage = (msg: String) =>
  dialog.showMessageBox({
    type: 'info',
    message: `You activated action: "${msg}"`,
    buttons: ['Close'],
  });

export const menu = Menu.buildFromTemplate([
  {
    label: 'Preferences',
    submenu: [
      {
        label: 'Prefer Dark Theme',
        type: 'checkbox',
        click: () => {
             global.__MAIN_WINDOW__?.webContents.send('switch-theme');
        },
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
        click: () => ipcMain.emit('open-file-dialog'),
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
            message: `M3u editor
                        ${process.env.npm_package_version}
                        Running against Electron 9.0.2
                        This program comes with absolutely no warranty.
                        See the GNU Lesser General Public License.`,
            buttons: ['Close'],
          }),
      },
    ],
  },
]);
