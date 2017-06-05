const os = require('os')
const is = require('type-is')
const extract = require('./extract')

module.exports = function (options = {}) {
  let dest = options.dest || os.tmpdir()
  let fnDestFilename = options.fnDestFilename || function(fieldname, filename) {
    return Date.now() + fieldname + filename
  }

  return async (ctx, next) => {
    if (!is(ctx.req, ['multipart'])) return next()

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
