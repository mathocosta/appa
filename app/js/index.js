'use strict'

const { ipcRenderer } = require('electron')

/* -- Funcionamento do editor -- */
let editor = document.querySelector('#editor')
let output = document.querySelector('#output')
let textarea = editor.getElementsByTagName('textarea')[0]

// placing the markdown filter
// textarea.addEventListener('input', function () {
//   output.innerHTML = marked(this.value)
// })

// enable tab key in textarea
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
/* --/ Funcionamento do editor -- */

ipcRenderer.on('salvar-como', function (ev) {
  let text = textarea.value
  ipcRenderer.send('salvar-novo', text)
})

ipcRenderer.on('salvar', function (ev) {
  let text = textarea.value
  ipcRenderer.send('salvar-existente', text)
})

ipcRenderer.on('arquivo-aberto', function (ev, path, data) {
  textarea.value = data
  // output.innerHTML = marked(data)
  ipcRenderer.send('atualizar-globalPath', path)
})

// Config to show the Markdown Preview
ipcRenderer.on('show-preview', function (ev) {
  let data = textarea.value
  ipcRenderer.send('open-preview', data)
})
