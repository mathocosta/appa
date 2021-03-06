'use strict'

const { ipcRenderer } = require('electron')

// Funcionamento do editor
let editor = document.querySelector('#editor')
let output = document.querySelector('#output')
let textarea = editor.getElementsByTagName('textarea')[0]

// Enable tab key in textarea
textarea.addEventListener('keydown', function (ev) {
  let key = ev.keyCode || ev.which

  if (key === 9) {
    ev.preventDefault()

    let val = this.value,
        start = this.selectionStart,
        end = this.selectionEnd

    this.value = `${val.substring(0, start)} \t ${val.substring(end)}`

    this.selectionStart = this.selectionEnd = start + 1

    return false
  }

})

ipcRenderer.on('salvar-como', (ev) => {
  let text = textarea.value
  ipcRenderer.send('salvar-novo', text)
})

ipcRenderer.on('salvar', (ev) => {
  let text = textarea.value
  ipcRenderer.send('salvar-existente', text)
})

ipcRenderer.on('arquivo-aberto', (ev, path, data) => {
  textarea.value = data
  ipcRenderer.send('atualizar-globalPath', path)
})

// Config to show the Markdown Preview
ipcRenderer.on('show-preview', (ev) => {
  let data = textarea.value
  ipcRenderer.send('open-preview', data)
})
