import { ipcMain, dialog } from 'electron';

ipcMain.on('open-file-dialog', async (event) => {
  const options: Electron.OpenDialogOptions = {
    title: 'Open playlist',
    buttonLabel: 'Open',
    filters: [
      { name: 'Playlists', extensions: ['m3u'] },
      { name: 'All Files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  };

  const res = await dialog.showOpenDialog(options);
  if (res) {
    global.__MAIN_WINDOW__?.webContents.send('selected-file', {
      fileLocation: res.filePaths[0],
    });
  }
});
