const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')

var menu = [{
  label: 'File',
  submenu: [
    {
      label: 'Open File',
      accelerator: 'CmdOrCtrl + O',
      click: function () {
        dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{
            name: 'Markdown',
            extensions: ['md', 'txt']
          }]
        }, (file) => {
          if (file === 'undefined') {
            console.log('arquivo nao encontrado')
          } else {
            fs.readFile(file[0], 'utf8', (err, data) => {
              if (err) {
                throw err
              } else {
                BrowserWindow.getFocusedWindow().webContents.send('arquivo-aberto', file[0], data)
              }
            })
          }
        })
      }
    },
    {
      label: 'Save',
      accelerator: 'CmdOrCtrl + S',
      click: function () {
        BrowserWindow.getFocusedWindow().webContents.send('salvar')
      }
    },
    {
      label: 'Save As',
      click: function () {
        BrowserWindow.getFocusedWindow().webContents.send('salvar-como')
      }
    }
  ]
},
{
  label: 'Edit',
  submenu: [
    {
      label: 'Show Preview',
      click: function () {
        BrowserWindow.getFocusedWindow().webContents.send('show-preview')
      }
    }
  ]
}];

/**
 * devMenu is only for development
 * makes the comands of reload, dev tools and quit avaliable
 */
let devMenu = {
  label: 'Developer',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl + R',
      click: function (item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload()
      }
    },
    {
      label: 'Dev Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click: function (item, focusedWindow) {
        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
      }
    },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => app.quit()
    }
  ]
}

menu.push(devMenu)

module.exports = menu;
