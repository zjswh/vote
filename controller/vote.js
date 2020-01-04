const express = require('express')
const userUtil = require('../util/user')
const router = express.Router()
const voteUtil = require('../util/vote')

const format = require('../lib/format')

router.use('/getInfoByInclude',async (req,res)=>{
    const {include_id,type} = req.query
    const voteId = await voteUtil.getIncludeVoteId(include_id,type)
    if(!voteId){
        res.json(format.data({}))
    }
    //获取绑定的投票
    const voteInfo = await voteUtil.getInfo(voteId)
    res.json(format.data(voteInfo))
}) 

router.use('/getInfoById',async (req,res)=>{
    const {id} = req.query
    //获取用户信息
    //token = 
    const token = req.headers.token
    const userInfo = await userUtil.getUserInfo(token)
    const userId = userInfo.id || 0

    //获取投票基本信息
    let info = await voteUtil.getInfo(id)
    if(!info){
        res.json(format.data('',9,'投票不存在或已被和删除'))
    }

    //获取对应选项
    let list = await voteUtil.getContentInfo(id,userId)
    info.list = list
    res.json(format.data(info))
})


module.exports = router