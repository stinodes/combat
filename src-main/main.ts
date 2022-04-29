import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from 'electron-devtools-installer'
import { handleDirOpen } from './fileDialog'
import { parseResources } from './resources/parse'
import {
  createCharacterPreview,
  openCharacter,
} from './characters/openCharacter'

const isDev = process.env.NODE_ENV === 'development'

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isDev) {
    installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then(() => {
        mainWindow.loadURL('http://localhost:3000')
        mainWindow.webContents.openDevTools()
      })
      .catch(err => console.log('An error occurred: ', err))
  } else {
    mainWindow.loadFile(path.join('build', 'index.html'))
  }
}

app
  .whenReady()
  .then(() => {
    ipcMain.handle('dialog:openDir', handleDirOpen)
    ipcMain.handle('data:parseResources', parseResources)
    ipcMain.handle('data:createCharacterPreview', createCharacterPreview)
    ipcMain.handle('data:openCharacter', openCharacter)
  })
  .then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
