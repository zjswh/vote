const redis = require('../lib/redis')
const tool = require('./tool')
const format = require('../lib/format')
const _ = require('lodash')

const {program_vote,program_vote_content,program_vote_include,Sequelize} = require('../models')

const  checkVoteState = (start_time,end_time)=>{
    const now = Math.round((new Date()).getTime()/1000)
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

module.exports = {
    getInfo : async (id) =>{
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
        info.vote_state = checkVoteState(info.start_time,info.end_time)
        return info
    },

    getContentInfo : async (id,userId = '') =>{
        const key = 'activity_vote_content:' + id
        let list = await redis.getAsync(key)
        if(!list){
            list = await program_vote_content.getContentInfo(id)
            redis.setAsync(key,JSON.stringify(list))
        }else{
            list = JSON.parse(list)
        }
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
            if(userId && content_ids && _.indexOf(content_ids,val.id) != -1){
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
            res = await program_vote_content.findOne({
                where : {
                    id : value.id
                }
            })
            const contentValue = {
                title : value.title,
                intro : value.intro,
                pic : value.pic || '',
                videoUrl : value.videoUrl || '',
                videoCoverImg : value.videoCoverImg || '',
                update_time : nowTime,
                sort : value.sort || 0

            }
            res = await res.update(contentValue)
        })
        return vote_id
    },

    getList : async (where,page,num) => {
        const topic = where.topic || ''
        if(topic){
            where.topic = {
              [Sequelize.Op.like]: '%'+topic+'%'
            }
        }
        let  result = await program_vote.getList(where,page,num)
    
        let list = result.rows
        let count = result.count

        if(!_.isEmpty(list)){
            //获取cname
            const cname = await tool.getCname(1000)
            list = list.toJSON()
            list.forEach((val,key)=>{
                const url = cname + '/vote/?id='+val.id+'&uin='+val['access_id']
                list[key]['url'] = url
            })
            console.log(list)
        }
        return {
            list,
            count
        }
    }
}