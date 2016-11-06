const fs = require('fs')
const sass = require('node-sass')

sass.render({
  file: './src/sass/main.sass',
  includePaths: ['./src/sass'],
  outFile:'./app/css/main.css',
  outputStyle: 'expanded',
  sourceMap: true
}, function (sassError, result) {
  if (sassError) throw sassError

  fs.writeFile('./app/css/main.css', result.css, (err) => {
    if (err) throw err
    console.log('Sass Compiled')
  })
})

module.exports = sass

