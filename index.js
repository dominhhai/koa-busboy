const os = require('os')
const extract = require('./extract')

module.exports = function (options = {}) {
  let dest = options.dest || os.tmpdir()
  let fnDestFilename = options.fnDestFilename || function(fieldname, filename) {
    return Date.now() + fieldname + filename
  }

  return async (ctx, next) => {
    if (!ctx.is('multipart')) {
      return next()
    }

    try {
      let { files, fields } = await extract(ctx.req, dest, fnDestFilename, Object.assign({}, options))
      ctx.request.body = fields
      ctx.request.files = files

      await next()
    } catch (e) {
      throw e
    }
  }
}
