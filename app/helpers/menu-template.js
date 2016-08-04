const {app, BrowserWindow, dialog} = require('electron')
const fs = require('fs')

var menu = [{
  label: 'File',
  submenu: [
    {
      label: 'Open File',
      accelerator: 'CmdOrCtrl + O',
      click: function (menuItem, focusedWindow) {
        dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [{
            name: 'Markdown',
            extensions: ['md', 'txt']
          }]
        }, (file) => {
          if (file) {
            fs.readFile(file[0], 'utf8', (err, data) => {
              if (err) {
                throw err
              } else {
                focusedWindow.webContents.send('arquivo-aberto', file[0], data)
              }
            })
          }
        })
      }
    },
    {
      label: 'Save',
      accelerator: 'CmdOrCtrl + S',
      click: function (menuItem, focusedWindow) {
        focusedWindow.webContents.send('salvar')
      }
    },
    {
      label: 'Save As',
      click: function (menuItem, focusedWindow) {
        focusedWindow.webContents.send('salvar-como')
      }
    }
  ]
},
{
  label: 'Edit',
  submenu: [
    {
      label: 'Show Preview',
      click: function (menuItem, focusedWindow) {
        focusedWindow.webContents.send('show-preview')
      }
    },
    {
      label: 'GitHub Style',
      type: 'checkbox',
      click: (menuItem) => global.githubStyle = menuItem.checked
    },
    {
      type: 'separator'
    },
    {
      role: 'undo'
    },
    {
      role: 'redo'
    },
    {
      type: 'separator'
    },
    {
      role: 'cut'
    },
    {
      role: 'copy'
    },
    {
      role: 'paste'
    },
    {
      role: 'pasteandmatchstyle'
    },
    {
      role: 'delete'
    },
    {
      role: 'selectall'
    }
  ]
},
{
  label: 'About',
  click: () => require('electron').shell.openExternal('https://github.com/mathocosta/appa/blob/master/README.md')
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
// TODO: make it appears only on development
menu.push(devMenu)

module.exports = menu;
