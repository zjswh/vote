const express = require('express')
const app = new express()
const port = 3000
const userRouter = require('./controller/user')
const voteRouter = require('./controller/vote')

const bodyParser = require('body-parser')

app.use(express.json())
app.use(express.urlencoded({ extended : false }))


app.use((req,res,next)=>{
  console.log('请求开始了')
  next()
})

app.use('/user',userRouter)
app.use('/vote',voteRouter)

app.listen(port,()=>{
    console.log('server is running at http://127.0.0.1:' + port)
})