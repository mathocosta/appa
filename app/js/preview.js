'use strict'

const marked = require('marked')
const {ipcRenderer} = require('electron')

let output = document.querySelector('#output')

ipcRenderer.on('preview-data', function (ev, data) {
  output.innerHTML = marked(data)
})
