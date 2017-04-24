# koa-busboy
A koa's middleware for handling multipart form.
Note that, this middleware supports `Koa v2` only.

## Installation

```
$ npm i -S koa-busboy
```

## Usage
`koa-busboy` will adds all text `fields` to `ctx.request.body` object and uploaded `files` to `ctx.request.files` array.

To create middleware, simply call the module function with custom config options as following:

```javascript
const busboy = require('koa-busboy')
const uploader = busboy(options)
```

While, `options` is same as original [busboy](https://github.com/mscdex/busboy#api) module.

However, you can specify the upload folder to save files into with `dest` option. The default upload folder is your system temp folder (`os.tmpdir()`).

### Example
```javascript
const busboy = require('koa-busboy')
const koaRouter = require('koa-router')

const uploader = busboy({
  dest: './upload' // default is system temp folder (`os.tmpdir()`)
})
const router = koaRouter()

router.post('/upload', uploader, async ctx => {
  // fields
  // text fields is add to ctx.request.body object
  let { name } = ctx.request.body
  // files
  // uploaded files is add to ctx.request.files array
  let fileReadStream = ctx.request.files[0]
})
```
