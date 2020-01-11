const axios = require('axios')

const curl = async (url) =>{
    return await axios.get(url)
}
const res =  curl('http://127.0.0.1:3000/vote/getInfoById?id=61')

console.log(res)