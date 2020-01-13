const express = require('express')
const userUtil = require('../util/user')
const _ = require('lodash')
const router = express.Router()
const voteUtil = require('../util/vote')
const format = require('../lib/format')
const message = require('../config/message')

const checkAdminLogin = async (req,res,next)=>{
    
    const userInfo = await userUtil.getUserInfo(req)
    if(!userInfo || !userInfo.accountId){
        return {}
    }
    return userInfo

}

/**
 * 获取引用的投票信息
 * @route GET /vote/getInfoByInclude - 获取引用的投票信息
 * @group vote
 * @param {integer} include_id.query.required - 引用id
 * @param {string} type.query.required - 引用类型
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
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

/**
 * 保存引用
 * @route POST /vote/saveConfig - 保存引用
 * @group vote 
 * @param {string} token.header.required - token
 * @param {integer} vote_id.formData.required - 投票vote_id
 * @param {integer} include_id.formData.required - 引用id
 * @param {string} type.formData.required - 引用类型
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
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

/**
 * 获取投票信息
 * @route GET /vote/getInfoById - 获取投票信息
 * @group vote
 * @param {integer} id.query.required - 投票id
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
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

/**
 * 创建投票
 * @route POST /vote/create - 创建投票
 * @group vote 
 * @param {string} token.header.required - token
 * @param {string} topic.formData.required - 投票主题
 * @param {string} vote_intro.formData.required - 投票介绍
 * @param {integer} vote_type.formData.required - 投票类型 每日 单次
 * @param {integer} vote_way.formData.required - 投票方式 单选 多选
 * @param {integer} vote_choose_num.formData.required - 可投数
 * @param {string} banner.formData - 轮播图
 * @param {string} start_time.formData.required - 开始时间
 * @param {string} end_time.formData.required - 结束时间
 * @param {integer} is_rank.formData.required - 排序
 * @param {string} content.formData.required - 选项
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
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

/**
 * 修改投票
 * @route POST /vote/update 修改投票
 * @group vote 
 * @param {string} token.header.required - token
 * @param {integer} id.formData.required - 排序
 * @param {string} topic.formData.required - 投票主题
 * @param {string} vote_intro.formData.required - 投票介绍
 * @param {integer} vote_type.formData.required - 投票类型 每日 单次
 * @param {integer} vote_way.formData.required - 投票方式 单选 多选
 * @param {integer} vote_choose_num.formData.required - 可投数
 * @param {string} banner.formData - 轮播图
 * @param {string} start_time.formData.required - 开始时间
 * @param {string} end_time.formData.required - 结束时间
 * @param {integer} is_rank.formData.required - 排序
 * @param {string} content.formData.required - 选项
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
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

/**
 * 获取投票引用源
 * @route GET /vote/getIncludeFromVoteId
 * @group vote
 * @param {string} token.header.required - token
 * @param {integer} vote_id.query.required - 投票id
 * @param {integer} page.query - 页数
 * @param {integer} num.query - 每页显示个数
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
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

/**
 * 获取投票列表
 * @route GET /vote/getList
 * @group vote
 * @param {string} token.header.required - token
 * @param {string} topic.query - 投票主题
 * @param {integer} page.query - 页数
 * @param {integer} num.query - 每页显示个数
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
router.get('/getList',async (req,res,next) => {
    let userInfo = await checkAdminLogin(req,res,next)
    if(_.isEmpty(userInfo)){
        return res.json(format.data('',1,message.nologin))
    }
    const aid = userInfo.aid || 0

    let topic = req.query.topic || ''
    let page = req.query.page  || 1
    let num = req.query.num  || 10

    const where = {
        access_id : userInfo.uin,
        aid
    }

    if(topic) {
        where.topic = topic
    }
    const result = await voteUtil.getList(where,page,num)
    return res.json(format.data(result))
})


module.exports = router