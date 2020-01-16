const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const {CONFIG} = require('../config/config')
const config = CONFIG.swagger


// 配置 swagger-jsdoc
module.exports = {
    init : app => {
        const options = {
            definition: {
                // swagger 采用的 openapi 版本 不用改
                openapi: config.openapi,
                produces: [
                    "application/json",
                    "application/xml"
                ],
                host: 'localhost:3000',
                schemes: ['http', 'https'],
                // swagger 页面基本信息 自由发挥
                info: {
                    title: config.title,
                    version: config.version,
                }
            },
            // 重点，指定 swagger-jsdoc 去哪个路由下收集 swagger 注释
            apis: config.apis
        }
        
        const swaggerSpec = swaggerJSDoc(options)
        
        // 开放 swagger 相关接口，
        app.get('/swagger.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        })
        
        // 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由
        app.use(config.routerPath, swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    }
}
