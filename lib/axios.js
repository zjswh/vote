const axios = require('axios')

module.exports = {
    get : async (url,param = {},header = {}) =>{
        const result = await axios.get(url)
        if(result.status == 200){
            return  result.data
        }
        return  []
    },
    post : async (url,data = {},header = {}) =>{
        const result = await axios.post(url,data)
        if(result.status == 200 ){
            return  result.data
        }
        return  []
    },
    all : async (urls = []) =>{
        let arr = []
        urls.forEach(url => {
            arr.push(axios.get(url))
        });
        let data = []

        let res = await axios.all(arr)
        res.forEach(item=>{
            if(item.status == 200 && item.data.code == 200){
                data.push(item.data.data)
             }
        })
        return data
    },
}