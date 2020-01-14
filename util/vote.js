const redis = require('../lib/redis')
const tool = require('./tool')
const format = require('../lib/format')
const _ = require('lodash')

const {program_vote,program_vote_content,program_vote_include,program_vote_option_info,Sequelize} = require('../models')

const  checkVoteState = async (start_time,end_time)=>{
    const now = Math.round((Date.now()) / 1000)
    let  vote_state = 0
    if(end_time < now){
        vote_state = 2  //过期
    }else if(start_time <= now){
        vote_state = 1 //进行中
    }else{
        vote_state = 0 //未开始
    }
    return vote_state;
}

const getInfo = async (id)=>{
    const key = 'VoteConfig:' + id
    let info = await redis.getAsync(key)
    if(!info){
        info = await program_vote.getInfo(id)
        if(!info){
            redis.setAsync(key,JSON.stringify({}))
            redis.expireAsync(key,86400)
            return {}
        }
        info = info.toJSON()
        if(info){
            info.start_time = (new Date(info.start_time)).getTime() / 1000
            info.end_time = (new Date(info.end_time)).getTime() / 1000
        }
        redis.setAsync(key,JSON.stringify(info))
    }else{
        info = JSON.parse(info)
        if(_.isEmpty(info)){
            return {}
        }
    }
  
    //检测状态
    info.vote_state = await checkVoteState(info.start_time,info.end_time)
    return info
}

const userVote = async (userInfo,id,voteInfo) => {
    const vote_id = voteInfo.id
    const now = Math.round((Date.now()) / 1000)
    const user_id = userInfo.id

    const key = "VoteList:"+vote_id
    let list = await redis.hgetAsync(key,user_id)
    list = list ? JSON.parse(list) : []
    if(!_.isEmpty(list) && list.includes(id)){
        return {status:2}  //重复投票
    }
    //判断已投数
    const useNum = list.length
    if(useNum >= voteInfo.vote_choose_num){
        return {status:3} //次数用完
    }
    list.push(parseInt(id)) 
    await redis.hsetAsync(key,user_id,JSON.stringify(list))

    //投票数加一
    const voteKey = "VoteNum:"+vote_id
    const totalKey = "user_vote_num:"+vote_id
    await redis.zincrbyAsync(voteKey,1,id)
    await redis.zaddAsync(totalKey,1,user_id)
    //存储投票记录
    const info = {
        userNick: userInfo.userNick,
        loginType: userInfo.loginType,
        voteTime: now,
        userId: user_id,
        phone: userInfo.phone,
        userHeadImg: userInfo.userHeadImg,
        uin: userInfo.uin,
        voteId: vote_id,
        optionId: id,
        type : 'link'
    }
    redis.rpushAsync('VoteOptionInfo',JSON.stringify(info))
    const total = parseInt(await redis.zscoreAsync(voteKey,id))
    const count = parseInt(await redis.zcardAsync(totalKey)) || 0//参与总人数
    //发送dms
    return {
        status : 1,
        msg: {
            total,
            count
        }
    }
}

const saveVoteRecordToDb = async ()=>{
    const key = 'VoteOptionInfo'
    const len = await redis.llenAsync(key)
    const size = len > 1000 ? 1000 : len
    for(let i=0;i<size;i++){
        let info = await redis.lpopAsync(key)
        info = JSON.parse(info)
        program_vote_option_info.create(info)
    }
}

const getRank = async (id) => {
    let voteNum = await redis.zrevrangebyscoreAsync('VoteNum:'+id,'+inf','-inf','WITHSCORES')
    voteNum = format.arrayToObj(voteNum)
    const list = await getContent(id)
    list.forEach(val=>{
        if(!_.has(voteNum,val.id)){
            voteNum[val.id] = 0
        }
    })
    
    
}
const getContent = async (id) => {
    const key = 'activity_vote_content:' + id
    let list = await redis.getAsync(key)
    if(!list){
        list = await program_vote_content.getContentInfo(id)
        redis.setAsync(key,JSON.stringify(list))
    }else{
        list = JSON.parse(list)
    }
    return list
}

module.exports = {
    getRank,
    saveVoteRecordToDb,
    userVote,
    getInfo,
    getContentInfo : async (id,userId = '') =>{
        const list = await getContent(id)
        //获取每个项目的票数
        let voteNum = await redis.zrevrangebyscoreAsync('VoteNum:'+id,'+inf','-inf','WITHSCORES')
        voteNum = format.arrayToObj(voteNum)
        const pkey = "VoteList:" + id
        let content_ids = []
        if(userId){
            const data = await redis.hgetAsync(pkey,userId)
            if(data){
                content_ids = JSON.parse(data) 
            }
        }

        list.forEach((val,key) => {
            //判断用户是否投票
            list[key].is_vote = 0
            list[key].voteNum = voteNum[val.id]
            if(userId && content_ids && content_ids.includes(val.id)){
                list[key].is_vote = 1
            }
        })
        return list
    },
    getVoteInclude: async (vote_id,page,num) =>{
        const where = {
            vote_id
        }
        const result = await program_vote_include.getList(where,page,num)
        const data = {
            list:result.rows,
            total:result.count,
        }
        return data
    },
    getIncludeVoteId : async (include_id,type)=>{
        const key = 'VoteInclude'
        const pkey = include_id + '_' + type
        let vote_id = await redis.hgetAsync(key,pkey)
        if(!vote_id){
            const info = await program_vote_include.findOne({
                where :{
                    include_id,
                    type
                },
                attributes : ['vote_id']
            })
            vote_id = info.toJSON().vote_id
            redis.hsetAsync(key,pkey,vote_id)
        }
        return vote_id
    },

    saveInclude : async (vote_id,include_id,type) => {
        //查询旧配置
        const info = await program_vote_include.findOne({
            where:{
                include_id,
                type,
                version : 1
            }
        })

        let res;
        if(info){  //更新
            res = await info.update({
                vote_id
            })
            //删除缓存
            
        }else{ //新建
            res = await program_vote_include.create({
                include_id,
                type,
                version : 1,
                vote_id
            })
        }
        if(!res){
            return 0
        }
        redis.hsetAsync('VoteInclude',include_id +'_'+ type,vote_id)
        let message = {
            status : 0,
            info : {}
        }
        // if(vote_id){
        //     message.status = 1
        //     message.info = await this.getInfo(vote_id)
        // }
        //发送dms消息

        return res.id
    },

    create : async (data,content) => {
        const nowTime = format.date((new Date()),'yyyy-MM-dd hh:mm:ss')
        data.create_time = nowTime
        data.update_time = nowTime
        //投票创建
        let res = await program_vote.create(data)
        if(!res){
            return 0
        }
        const vote_id = res.id
        const voteContent = []
        content.forEach((value,key)=>{
            voteContent[key] = {
                vote_id,
                title : value.title,
                intro : value.intro,
                pic : value.pic || '',
                videoUrl : value.videoUrl || '',
                videoCoverImg : value.videoCoverImg || '',
                create_time : nowTime,
                update_time : nowTime,
            }
        })
        //选项创建
        res = await program_vote_content.bulkCreate(voteContent)
        if(!res){
            return 0
        }
        return vote_id
    },
    update : async (id,data,content) => {
        if(!id){
            return 0
        }
        const nowTime = format.date((new Date()),'yyyy-MM-dd hh:mm:ss')
        data.update_time = nowTime
        //投票创建
        let res = await program_vote.findOne({
            where : {
                id
            }
        })
        if(!res){
            return 0
        }
        res = await res.update(data)
        if(!res){
            return 0
        }
        const vote_id = res.id
        content.forEach(async value => {
            const contentValue = {
                title : value.title,
                intro : value.intro,
                pic : value.pic || '',
                videoUrl : value.videoUrl || '',
                videoCoverImg : value.videoCoverImg || '',
                update_time : nowTime,
                sort : value.sort || 0

            }
            if( value.id ){
                res = await program_vote_content.findOne({
                    where : {
                        id : value.id
                    }
                })
                res = await res.update(contentValue)
            }else{
                contentValue.vote_id = vote_id
                res = await program_vote_content.create(contentValue)
            }
        })
        redis.delAsync("VoteConfig:"+vote_id)
        redis.delAsync("activity_vote_content:"+vote_id)
        return vote_id
    },

    getList : async (where,page,num) => {
        const topic = where.topic || ''
        if(!_.isEmpty(topic)){
            where.topic = {
              [Sequelize.Op.like]: '%'+topic+'%'
            }
        }
        let  result = await program_vote.getList(where,page,num)
        result = format.modelToJson(result)

        let list = result.rows
        let count = result.count

        if(!_.isEmpty(list)){
            //获取cname
            const cname = await tool.getCname(1000)
            for (let p of list) {
                p.previewUrl = cname + '/vote/?id='+p.id+'&uin='+p.access_id
            }
        }

        return {
            list,
            count
        }
    },
    checkIp : async (req,id) => {
        const ip = await format.getIp(req)
        const key = 'set_vote_time_'+ip+'_'+id
        const flag = await redis.getAsync(key)
        if(flag){
            return false
        }
        redis.setAsync(key,1)
        redis.expireAsync(key,10)
        return true
    },

    checkVoteState,
    checkUserVote : async (user_id,id,vote_id)=>{
        const key = "VoteList:"+vote_id
        const list = await redis.hgetAsync(key,user_id)
        if(!list){ 
            return true
        }
        list = JSON.parse(list)
        if(list.includes(id)){
            return false 
        }
        return true 
    }
}