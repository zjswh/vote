const {CONFIG} = require('../config/config')
const config = CONFIG.swagger
const path = require('path')

// 配置 swagger-jsdoc
module.exports = {
    init : app => {
        const expressSwagger = require('express-swagger-generator')(app)
        const options = {
            swaggerDefinition: {
                produces: [
                    "application/json",
                    "application/xml"
                ],
                host: '127.0.0.1:3000',
                schemes: ['http', 'https'],
                // swagger 页面基本信息 自由发挥
                info: {
                    title: config.title,
                    version: config.version,
                    description: 'This is a sample server',
                }
            },
            basedir: __dirname,
            // 重点，指定 swagger-jsdoc 去哪个路由下收集 swagger 注释
            files: config.apis //config.apis
        }
        
        expressSwagger(options)

    }
}
