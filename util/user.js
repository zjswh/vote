const jwt = require('jwt-simple')
const redis = require('../lib/redis')
const utility = require('utility')
const uniqid = require('uniqid')
const key = 'guangdianyun_key'
const CRYPT_KEY = 'ac8d51aj'

module.exports = {
    getUserInfo : async (req) => {
        const token = req.headers.token || ''
        if(!token){
            return {}
        }

        const realToken = jwt.decode(token, key).token

        const userInfo = await redis.getAsync(realToken)
        console.log(userInfo)

        return JSON.parse(userInfo)
    },
    consoleLogin : async (phone,password) => {
        password = utility.md5(CRYPT_KEY+password)
        const user = {
            uin : 1003,
            accountId : 58,
            aid: 0
        }
        const now = Date.now()
        const token = utility.md5(uniqid(now+user.uin)).toLowerCase()
        redis.setAsync(token,JSON.stringify(user))
        redis.expireAsync(token,now+86400)

        const payload = {
            token,
            expires : now +  + 86400
        } 

        const realToken = jwt.encode(payload,key)
        return realToken
    }
}
