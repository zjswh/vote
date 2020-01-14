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
    },
    liveLogin : async (phone,password) => {
        password = utility.md5(CRYPT_KEY+password)
        const user = {
            id: 1500961,
            isDisableChat: 0,
            isSafe: 1,
            loginType: "5",
            openUid: null,
            phone: "15005781111",
            status: 1,
            token: "E337A14A4D943D61FAC440B1032E2C50",
            uin: 1003,
            userHeadImg: "http://thirdwx.qlogo.cn/mmopen/vi_32/HIkzwLtxjRBQD4bqxBJtZicfyLmmjica38VOITIoC9Q0Dar7iaX4rLaTrAjV8kAfTMsdxtDCiaf3u8fvgJOlgib5sIA/132",
            userNick : "aaa"
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
