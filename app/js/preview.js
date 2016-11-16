'use strict'

const marked = require('marked')
const { ipcRenderer, remote } = require('electron')

const Config = require('electron-config')
const config = new Config();

let output = document.querySelector('#output')

ipcRenderer.on('preview-data', function (ev, data) {
  output.innerHTML = marked(data)

  if (config.get('githubStyle')) {
    output.className += ' markdown-body'
  }
})
