const redis = require('../lib/redis')
const format = require('../lib/format')
const _ = require('lodash')

const {program_vote,program_vote_content,program_vote_include} = require('../models')

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
            info = info.toJSON()
            if(info){
                info.start_time = (new Date(info.start_time)).getTime() / 1000
                info.end_time = (new Date(info.end_time)).getTime() / 1000
            }
            redis.setAsync(key,JSON.stringify(info))
        }else{
            info = JSON.parse(info)
        }

        if(!info){
            return info
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
    getIncludeVoteId : async (include_id,type)=>{
        const key = 'VoteConfigs'
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
    }
}