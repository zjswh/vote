const jwt = require('jwt-simple')
const redis = require('../lib/redis')

const key = 'guangdianyun_key'


module.exports = {
    getUserInfo : async (token) => {
        if(!token){
            return {}
        }
        const realToken = jwt.decode(token, key).token
        const userInfo = await redis.getAsync(realToken)
        return JSON.parse(userInfo)
    },
    getTokenUserId : async (token) => {
        if(!token){
            return 0
        }
        const realToken = jwt.decode(token, key).token
        const userInfo = await redis.getAsync(realToken)
        return JSON.parse(userInfo.userid)
    },
}
