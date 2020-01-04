const _ = require('lodash')

module.exports = {
    data : (data = '',code = 200,message = '')=>{
        return {
            data,
            code,
            message
        }
    },
    arrayToObj : (arr) =>{
        if(_.isEmpty(arr)){
            return {}
        }
        const length = arr.length
        let index = 0
        let a = {}

        while(index < length){
            const key = arr[index]
            const value = arr[index + 1]
            index = index + 2
            a[key] = parseInt(value)
        }
        return a
    }
}