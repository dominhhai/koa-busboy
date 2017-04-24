const os = require('os')
const extract = require('./extract')

module.exports = function (options = {}) {
  let dest = options.dest || os.tmpdir()

  return async (ctx, next) => {
    try {
      let { files, fields } = await extract(ctx.req, dest, Object.assign({}, options))
      ctx.request.body = fields
      ctx.request.files = files

      await next()
    } catch (e) {
      throw e
    }
  }
}
