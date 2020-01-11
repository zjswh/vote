const axios = require('../lib/axios')
module.exports = {
    getCname : async uin =>{
        const res = await axios.get('http://47.110.9.192/v1/system/Openapi/getCname?uin=1000')
        let cname = ''
        if(res.code == 200){
            cname = res.data
        }
        return cname
    }
}