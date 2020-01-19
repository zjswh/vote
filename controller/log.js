const express = require('express')
const router = express.Router()
const {showAccess} = require('../util/log')
const format = require('../lib/format')

/**
 * 获取日志
 * @route GET /log/list
 * @group log
 * @summary 获取日志
 * @param {string} api.query - api名称
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
router.get('/list',async (req,res)=>{
    const api = req.query.api || ''
    const page = req.query.page || 1
    const num = req.query.num || 10
    const list = await showAccess(api,page,num)
    return res.json(format.data(list))
})

module.exports = router