const express = require('express')
const app = new express()
const port = 3000
const userRouter = require('./controller/user')
const voteRouter = require('./controller/vote')
const logRouter = require('./controller/log')

const format = require('./lib/format')
const bodyParser = require('body-parser')
const swagger = require('./swagger/generator')
// const swagger = require('./swagger/index')
const validate = require('express-validation')
const _ = require('lodash')
const {access} = require('./util/log')


app.use(express.json())
app.use(express.urlencoded({ extended : false }))

swagger.init(app)

app.use((req,res,next)=>{
  access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
  next()
})

app.use('/user',userRouter)
app.use('/vote',voteRouter)
app.use('/log',logRouter)

app.use((req,res)=>{
  return res.status(404).json(format.data('',9,'接口不存在'))
})

// app.use((err, req, res, next)=>{
  // if(err){
  //   if (err instanceof validate.ValidationError) {
  //     const errmsg = _.first(_.first(err.errors).messages)
  //     return res.status(err.status).json(format.data('',2,errmsg))
  //   }
  //   return res.status(500).json(format.data('',9,'服务异常'))
  // }
// })

app.listen(port,()=>{
    console.log('server is running at http://127.0.0.1:' + port)
})