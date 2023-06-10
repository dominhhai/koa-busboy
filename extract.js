const fs = require('fs')
const path = require('path')
const Busboy = require('busboy')
const appendField = require('append-field')

module.exports = function (req, dest, fnDestFilename, opts = {}) {
  return new Promise((resolve, reject) => {
    let files = []
    let fields = {}

    let busboy = Busboy(Object.assign({}, opts, {headers: req.headers}))
    busboy.on('file', (fieldname, fileStream, info) => {
      const { filename, encoding, mimeType } = info;
      if (!filename) return fileStream.resume()
      
      if (opts.acceptMimeTypes.length > 0 && opts.acceptMimeTypes.indexOf(mimeType) < 0) {
        appendField(fields, "uploadError", `UNSUPPORTED_MIMETYPE: ${mimeType}`)
        return fileStream.resume();
      }
    
      files.push(new Promise(function (resolve, reject) {
        let tmpName = fnDestFilename(fieldname, filename)
        let tmpPath = path.join(dest, path.basename(tmpName))

        fileStream.pipe(fs.createWriteStream(tmpPath))
          .on('error', reject)
          .on('close', () => {
            let rs = fs.createReadStream(tmpPath)
            rs.fieldname = fieldname
            rs.filename = filename
            rs.encoding = encoding
            rs.mimetype = mimeType

            resolve(rs)
          })
      }))
    })

    busboy.on('field', (name, value) => {
      if (Object.getOwnPropertyDescriptor(Object.prototype, name)) {
        name = '_' + name
      }
      appendField(fields, name, value)
    })

    busboy.on('close', () => {
      if (files.length) {
        Promise.all(files)
          .then(files => resolve({ fields, files }))
          .catch(reject)
      } else {
        resolve({ fields, files })
      }
    })

    busboy.on('error', reject)
    busboy.on('partsLimit', () => reject(new Error('LIMIT_PART_COUNT')))
    busboy.on('filesLimit', () => reject(new Error('LIMIT_FILE_COUNT')))
    busboy.on('fieldsLimit', () => reject(new Error('LIMIT_FIELD_COUNT')))

    if (req.rawBody) {
      busboy.end(req.rawBody)
    } else {
      req.pipe(busboy);
    }
  })
}
