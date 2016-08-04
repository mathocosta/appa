'use strict'

const marked = require('marked')
const {ipcRenderer, remote} = require('electron')

let output = document.querySelector('#output')

ipcRenderer.on('preview-data', function (ev, data) {
  output.innerHTML = marked(data)

  if (remote.getGlobal('githubStyle')) {
    output.className += ' markdown-body'
  }
})
