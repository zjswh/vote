const fs = require('fs')
const path = require('path')

const filename1 = path.resolve(__dirname,'data.txt')
const filename2 = path.resolve(__dirname,'data-bak.txt')

const readStream = fs.createReadStream(filename1)
const writeStream = fs.createWriteStream(filename2)

readStream.pipe(writeStream)

readStream.on('data',chunk=>{
    console.log(chunk.toString())
})

readStream.on('end',()=>{
    console.log('拷贝完成')
})
