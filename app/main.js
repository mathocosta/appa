const electron = require('electron')
const { app, BrowserWindow, Menu, dialog, ipcMain } = electron
const fs = require('fs')
const menu = require('./helpers/menu-template.js')

let globalPath
let win

app.on('ready', () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu))

  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(`file://${__dirname}/index.html`)
  win.on('close', () => win = null)
})

app.on('window-all-close', () => app.quit())

// FIXME: needs a refactoring
ipcMain.on('salvar-novo', (ev, data) => {
  dialog.showSaveDialog({
    filters: [
      { name: 'text', extensions: ['txt'] },
      { name: 'markdown', extensions: ['md'] }
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

  preview.loadURL(`file://${__dirname}/helpers/preview.html`)
  preview.webContents.on('did-finish-load', () => {
    preview.webContents.send('preview-data', data)
  })
})

/**
 * function to write the file
 * when save
 *
 * @param {any} path
 * @param {any} data
 */
function writeFile (path, data) {
  fs.writeFile(path, data, (err) => {
    if (err) throw err
  })
}
