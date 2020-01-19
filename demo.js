// const _ = require('lodash')
// const arr = [167,2,187,29,200,39]
// const ss = _.chunk(arr,2)
// console.log(_.fromPairs(ss))

// const arr = [
//     {id:1,name:"swh",age:12},
//     {id:2,name:"ddd",age:34},
//     {id:3,name:"ggg",age:30}
// ]
// const list = _.keyBy(arr,o=>{
//     return o.id
// })
// const ids = _.map(arr, 'id');
// const con = _.fill(ids,0)
// console.log(con)

//标准输入输出
// process.stdin.pipe(process.stdout)

// const http = require('http')
// const client = http.createServer((req,res)=>{
//     if(req.method == 'POST'){
//         req.pipe(res)
//     }
// })
// client.listen(3001);
// console.log('http://127.0.0.1:3001')

// const moment = require('moment')
// console.log(moment().format('YYYY-MM-DD'))

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const filename = path.resolve(__dirname,'logs/access.log')

const readStream = fs.createReadStream(filename)

//创建readline对象
const rl = readline.createInterface({
    input: readStream
})

let chromeNum = 0
let sum = 0
rl.on('line',(lineData)=>{
    if(!lineData){
        return 
    }
    //记录总行数
    sum++
    const arr = lineData.split(' -- ')
    if(arr[2] && arr[2].includes('Chrome')){
        chromeNum++
    }
})

//监听完成

rl.on('close',()=>{
    console.log('Chrome 占比：' + chromeNum / sum)
})