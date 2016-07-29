const electron = require('electron')
const {app, BrowserWindow, Menu, dialog, ipcMain} = electron
const fs = require('fs')
const menu = require('./app/helpers/menu-template.js')

let globalPath;

app.on('ready', () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

  let win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(`file://${__dirname}/app/index.html`)
  win.on('close', () => win = null)
})

app.on('window-all-close', () => app.quit())

// TODO: needs a refactoring
ipcMain.on('salvar-novo', (ev, data) => {
  dialog.showSaveDialog({
    filters: [
      {name: 'text', extensions: ['txt']},
      {name: 'markdown', extensions: ['md']}
    ]
  }, (fileName) => {
    if (fileName) {
      writeFile(fileName, data)
    }
  })
})

ipcMain.on('salvar-existente', (ev, data) => {
  if (globalPath !== undefined) {
    writeFile(globalPath, data)
  } else {
    BrowserWindow.getFocusedWindow().webContents.send('salvar-como')
  }
})

ipcMain.on('atualizar-globalPath', (ev, path) => globalPath = path)

ipcMain.on('open-preview', (ev, data) => {
  let preview = new BrowserWindow({
    width: 500,
    height: 500
  })

  preview.loadURL(`file://${__dirname}/app/helpers/preview.html`)
  preview.webContents.on('did-finish-load', () => {
    preview.webContents.send('preview-data', data)
  })
})

/**
 * Write File
 * Function to create or update the file according to path
 * @param path
 * @param data = contents of the file
 */
function writeFile (path, data) {
  fs.writeFile(path, data, (err) => {
    if (err) throw err
  })
}
