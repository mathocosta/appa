const fs = require('fs')

const { app,
        BrowserWindow,
        Menu,
        dialog,
        ipcMain
      } = require('electron')

const Config = require('electron-config')
const config = new Config(require('./helpers/config-defaults.js'))

const menuTemplate = require('./helpers/menu-template.js')


let globalPath
let win

app.on('ready', () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
  lastMenuConfig(Menu)

  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(`file://${__dirname}/index.html`)
  win.on('close', () => win = null)
})

app.on('window-all-close', () => app.quit())



/**
 * All the ipc configuration
 */
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
 * Functions
 */

/**
 * function to write the file
 * when save
 *
 * @param {String} path
 * @param {String} data
 */
function writeFile (path, data) {
  fs.writeFile(path, data, (err) => {
    if (err) throw err
  })
}

/**
 * function to initialize the settings menu
 * to the last time the app was used
 *
 * @param {Object} menu
 */
function lastMenuConfig (menu) {
  console.log(`getting the config in ${app.getPath('userData')}`)
  menu.getApplicationMenu().items[1].submenu.items[1].checked = config.get('githubStyle') || false
}