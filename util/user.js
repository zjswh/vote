const jwt = require('jwt-simple')
const redis = require('../lib/redis')
const utility = require('utility')
const uniqid = require('uniqid')
const _ = require('lodash')
const {user,lps_soldier,sequelize} = require('../models')
const key = 'guangdianyun_key'
const CRYPT_KEY = 'ac8d51aj'

module.exports = {
    getUserInfo : async (req) => {
        const token = req.headers.token || ''
        if(!token){
            return {}
        }
        const jwtInfo = jwt.decode(token, key)
        if(!jwtInfo.expires || !jwtInfo.token){
            return {}
        }
        const now = Math.round(Date.now() / 1000) 
        if(jwtInfo.expires < now){
            return {}
        }
        const realToken = jwtInfo.token
        const userInfo = await redis.getAsync(realToken)
        if(!userInfo){
            return {}
        }
        return JSON.parse(userInfo)
    },
    consoleLogin : async (phone,password,remember = 1) => {
        password = utility.md5(CRYPT_KEY+password)
        const expires = remember*86400

        let userInfo = await lps_soldier.findOne({
            where : {
                phone
            }
        })
        if(!userInfo){
            return {
                status:0,
                msg:'用户不存在'
            }
        }
        if(userInfo.password != password){
            return {
                status:0,
                msg:'密码错误'
            }
        }
        let info = await sequelize.query("SELECT * FROM `yun_tvbc`.`user` WHERE uin=" + userInfo.uin)
        info = _.first(info)
        _.assign(info,userInfo)
        const now = Math.round(Date.now() / 1000) 
        const token = utility.md5(uniqid(now+info.uin)).toLowerCase()
        redis.setAsync(token,JSON.stringify(info))
        redis.expireAsync(token,expires)

        const payload = {
            token,
            expires : now + expires
        } 

        const realTooken = jwt.encode(payload,key)
        return {
            status:1,
            msg:realTooken
        }
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
