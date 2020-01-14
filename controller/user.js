const express = require('express')
const {User,Sequelize} = require('../models')
const stringRandom = require('string-random');
const format = require('../lib/format')
const router = express.Router()
const Op = Sequelize.Op
const redis = require('../lib/redis')
const userUtil = require('../util/user')

/**
 * B端登录
 * @route POST /user/consoleLogins
 * @group user
 * @summary B端登录
 * @param {integer} phone.param.required - phone
 * @param {string} password.param.required - password
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
router.post('/consoleLogins',async (req,res)=>{
    const {phone,password} = req.body
    const token = await userUtil.consoleLogin(phone,password)
    return res.json(format.data({
        token,
        version : 'test'
    }))
    
})

/**
 * C端登录
 * @route POST /user/liveLogin
 * @group user
 * @summary C端登录
 * @param {integer} phone.param.required - phone
 * @param {string} password.param.required - password
 * @returns {object} 200 - An array of vote info
 * @returns {Error}  default - Unexpected error
 */
router.post('/liveLogin',async (req,res)=>{
    const {phone,password} = req.body
    const token = await userUtil.liveLogin(phone,password)
    return res.json(format.data(token))
    
})

router.get('/list',async (req,res)=>{
    let {page,num} = req.query
    page = page || 1
    num = num || 10
    const limit = parseInt(num) 
    const offset = (page - 1) * num 

    let result = await User.findAndCountAll({
        where : {
            // lastName : 'cc'
            // id : {
                // [Op.gt]: 6,                // id > 6
                // [Op.gte]: 6,               // id >= 6
                // [Op.lt]: 10,               // id < 10
                // [Op.lte]: 10,              // id <= 10
                // [Op.ne]: 20,               // id != 20
                // [Op.between]: [6, 10],     // BETWEEN 6 AND 10
                // [Op.notBetween]: [11, 15], // NOT BETWEEN 11 AND 15
                // [Op.in]: [1, 2],           // IN [1, 2]
                // [Op.notIn]: [1, 2],        // NOT IN [1, 2]
                // [Op.like]: '%hat',         // LIKE '%hat'
                // [Op.notLike]: '%hat',       // NOT LIKE '%hat'
                // [Op.iLike]: '%hat',         // ILIKE '%hat' (case insensitive)  (PG only)
                // [Op.notILike]: '%hat',      // NOT ILIKE '%hat'  (PG only)
                // [Op.overlap]: [1, 2],       // && [1, 2] (PG array overlap operator)
                // [Op.contains]: [1, 2],      // @> [1, 2] (PG array contains operator)
                // [Op.contained]: [1, 2],     // <@ [1, 2] (PG array contained by operator)
                // [Op.any]: [2,3]            // ANY ARRAY[2, 3]::INTEGER (PG only)
            // }
        },
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    });
    res.json(format.data({
        list : result.rows,
        count : result.count
    }))
})

router.get('/info',async (req,res)=>{
    const {id} = req.query
    const key = 'userinfo'+id
    let user = await redis.getAsync(key)
    if(!user){
        user = await User.findOne({
            where : {
                id
            }
        })
        redis.setAsync(key,JSON.stringify(user))
    }else{
        user = JSON.parse(user)
    }
    
    if(!user){
        res.json(format.data('',9,'信息不存在'))
    }
    res.json(format.data(user))
})

router.post('/create',async (req,res)=>{
    let {firstName,lastName,email} = req.body
    let user = await User.create({
        firstName ,
        lastName ,
        email 
    })
    res.json(user)
})

router.post('/update',async (req,res)=>{
    const {id,firstName,lastName,email} = req.body
    //查询是否存在
    let user = await User.findOne({
        where : {
            id
        }
    })
    if(!user){
        res.json(format.data('',9,'信息不存在'))
    }
    user = await user.update({
        firstName,
        lastName,
        email
    })

    res.json(format.data(user))
})

router.post('/delete',async (req,res)=>{
    const {id} = req.body
    //查询是否存在
    let user = await User.findOne({
        where : {
            id
        }
    })
    if(!user){
        res.json(format.data('',9,'信息不存在'))
    }
    user = await user.destroy()
    res.json(format.data(user))
})

router.post('/sync', async (req,res)=>{
    for(let i=0;i<100;i++){
        firstName = stringRandom(1, { numbers: false}),
        lastName = stringRandom(2, { numbers: false}),
        email = stringRandom(8, { numbers: false}) + '@qq.com'
  
        User.create({
            firstName ,
            lastName ,
            email 
        })
    }
    res.json({
        data : "success"
    })
})

module.exports = router
