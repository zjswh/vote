const fs = require('fs')
const path = require('path')
const env = process.env.NODE_ENV || 'development'
const moment = require('moment')
const readline = require('readline')

const creatWriteStream = fileName => {
    // const day = moment().format('YYYY-MM-DD')
    // fileName = `${day}.${fileName}`
    const fullFileName = path.resolve(__dirname,'../','logs',fileName)
    const wrireStream = fs.createWriteStream(fullFileName,{
        flags : 'a'
    })
    return wrireStream
}

const showAccess = (api = '') => {
    const fullFileName = path.resolve(__dirname,'../','logs','access.log')
    const readStream = fs.createReadStream(fullFileName,{"encoding":"utf8"})

   //创建readline对象
    const rl = readline.createInterface({
        input: readStream
    })
    const promise = new Promise((resolve,res)=>{
        let data = []
        rl.on('line', (lineData) => {
            if(!lineData){
                return 
            }
            const arr = dealLog(lineData)
            if(!api){
                data.push(arr)
            }else{
                if(arr.url && arr.url.includes(api)){
                    data.push(arr)
                }
            }
        });
         //文件读取完成事件
         rl.on('close', () => {
            return resolve(data)
        });
    })
    return promise
}

const dealLog = (log) => {
    const arr = log.split(' -- ')
    const method = arr[0]
    const url = arr[1]
    const user_agent = arr[2]
    const time = arr[3]
    return {
        method,
        url,
        user_agent,
        time
    }
}
const writeLog = (writeStrem,log) => {
    writeStrem.write(log + '\n')
}

const accessWriteStream = creatWriteStream('access.log')



const access = log=>{
    writeLog(accessWriteStream,log)

    // if(env == 'development'){
    //     console.log(log)
    // }else{
    //     writeLog(accessWriteStream,log)
    // }
}

module.exports = {
    access,
    showAccess
}