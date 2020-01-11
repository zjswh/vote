const express = require('express')
const userUtil = require('../util/user')
const _ = require('lodash')
const router = express.Router()
const voteUtil = require('../util/vote')
const format = require('../lib/format')
const message = require('../config/message')

const checkAdminLogin = async (req,res)=>{
    const userInfo = await userUtil.getUserInfo(req)
    if(!userInfo || !userInfo.accountId){
        return {}
    }
    return userInfo
}

router.get('/getInfoByInclude',async (req,res)=>{
    const {include_id,type} = req.query
    const voteId = await voteUtil.getIncludeVoteId(include_id,type)
    if(!voteId){
        return res.json(format.data({}))
    }

    //获取绑定的投票
    const voteInfo = await voteUtil.getInfo(voteId)
    if(_.isEmpty(voteInfo)){
       return res.json(format.data('',9,message.notexists))
    }
    return res.json(format.data(voteInfo))
}) 

router.post('/saveConfig',async (req,res)=>{
    const userInfo = await checkAdminLogin(req,res)
    if(_.isEmpty(userInfo)){
        return res.json(format.data('',1,message.nologin))
    }
    const {include_id,type,vote_id} = req.body
    const result = await voteUtil.saveInclude(vote_id,include_id,type)
    if(result){
        return res.json(format.data(message.setsuccess))
    }else{
        return res.json(format.data('',2,message.setfail))
    }
})

router.get('/getInfoById',async (req,res)=>{
    const {id} = req.query
    const userInfo = await userUtil.getUserInfo(req)
    const userId = userInfo.id || 0

    //获取投票基本信息
    let info = await voteUtil.getInfo(id)
    if(_.isEmpty(info)){
        return res.json(format.data('',9,message.notexists))
    }

    //获取对应选项
    let list = await voteUtil.getContentInfo(id,userId)
    info.list = list
    return res.json(format.data(info))
})

router.post('/create',async (req,res)=>{
    const userInfo =  await checkAdminLogin(req,res)
    if(_.isEmpty(userInfo)){
        return res.json(format.data('',1,message.nologin))
    }
    const access_id = userInfo.uin
    const aid = userInfo.aid || 0
    let {topic,vote_intro,vote_type,vote_way,vote_choose_num,banner,start_time,end_time,is_rank,content} = req.body
    const data = {
        access_id,
        aid,
        topic,
        vote_intro,
        vote_type,
        vote_way,
        vote_choose_num,
        banner,
        start_time,
        end_time,
        is_rank
    }
    content = JSON.parse(content)
    //创建投票
    const result = await voteUtil.create(data,content)
    return res.json(format.data(result))
})

router.post('/update',async (req,res)=>{
    const userInfo = await checkAdminLogin(req,res)
    if(_.isEmpty(userInfo)){
        return res.json(format.data('',1,message.nologin))
    }
    let {id,topic,vote_intro,vote_type,vote_way,vote_choose_num,banner,start_time,end_time,is_rank,content} = req.body
    const data = {
        topic,
        vote_intro,
        vote_type,
        vote_way,
        vote_choose_num,
        banner,
        start_time,
        end_time,
        is_rank
    }
    content = JSON.parse(content)
    //创建投票
    const result = await voteUtil.update(id,data,content)
    return res.json(format.data(result))
})

router.get('/getIncludeFromVoteId',async (req,res)=>{
    const userInfo = await checkAdminLogin(req,res)
    if(_.isEmpty(userInfo)){
        return res.json(format.data('',1,message.nologin))
    }
    let {vote_id,page,num} = req.query
    page = page || 1
    num = num || 10

    const list = await voteUtil.getVoteInclude(vote_id,page,num)
    return res.json(format.data(list))
})

router.get('/getList',async (req,res) => {
    const userInfo = await checkAdminLogin(req,res)
    if(_.isEmpty(userInfo)){
        return res.json(format.data('',1,message.nologin))
    }
    const aid = userInfo.aid || 0

    let {topic} = req.query 
    let page = req.query.page  || 1
    let num = req.query.num  || 10

    const where = {
        access_id : userInfo.uin,
        aid,
        topic
    }
    const result = await voteUtil.getList(where,page,num)
    return res.json(format.data(result))
})




module.exports = router