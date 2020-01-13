const express = require('express')
const app = new express()
const port = 3000
const userRouter = require('./controller/user')
const voteRouter = require('./controller/vote')
const format = require('./lib/format')
const bodyParser = require('body-parser')
// const swagger = require('./swagger/index')
const swagger = require('./swagger/generator')

app.use(express.json())
app.use(express.urlencoded({ extended : false }))

swagger.init(app)

app.use((req,res,next)=>{
  console.log('请求开始了')
  next()
})

app.use('/user',userRouter)
app.use('/vote',voteRouter)

app.use((req,res)=>{
  return res.status(404).json(format.data('',9,'接口不存在'))
})

app.use((err, req, res, next)=>{
  if(err){
    return res.status(500).json(format.data('',9,'服务异常'))
  }
})

app.listen(port,()=>{
    console.log('server is running at http://127.0.0.1:' + port)
})