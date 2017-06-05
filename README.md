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

However, you can specify the following options also.
* **dest** - _string_ - The folder to save uploaded files (Default: system temp folder - `os.tmpdir()`).

* **fnDestFilename** - _function_ - The function that defines the final filename which saved on `dest` folder. The `fnDestFilename(fieldname, filename)` function will return the name of file which be saved on disk. While `fieldname` is your uploaded field's name and `filename` is your uploaded file's name. (Default: `(fieldname, filename) => Date.now() + fieldname + filename`)

### Example
```javascript
const busboy = require('koa-busboy')
const koaRouter = require('koa-router')

const uploader = busboy({
  dest: './upload' // default is system temp folder (`os.tmpdir()`)
  fnDestFilename: (fieldname, filename) => uuid() + filename
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
