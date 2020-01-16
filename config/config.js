const path = require('path')
const env = process.env.NODE_ENV || 'development'
let CONFIG 

if(env == 'test'){
  CONFIG = {
    redis: {
        password: "dEQZJK6yPR",
        host: "r-bp1zmdndes4r8gv4cx.redis.rds.aliyuncs.com"
    },
    mysql : {
      username: "kkyoo",
      password: "kkyoo_aodian_2011_06_11",
      database: "gdy_activity_test",
      host: "rm-bp18a48nlw7l184ed.mysql.rds.aliyuncs.com",
      dialect: "mysql"
    },
    swagger : {
      openapi: '3.0.0',
      title: 'Express Template',
      version: '1.0.0',
      apis: [
          path.join(__dirname, '../controller/*.js')
      ],
      routerPath: '/api-docs'
    }
  }
}


if(env == 'development'){
  CONFIG = {
    redis: {
        password: "ZvZg2R8L8rbg9y",
        host: "121.42.227.165"
    },
    mysql : {
      username: "kkyoo",
      password: "kkyoo_aodian_2011_06_11",
      database: "broadcast_cloud",
      host: "121.42.227.165",
      dialect: "mysql"
    },
    swagger : {
      openapi: '3.0.0',
      title: 'Express Template',
      version: '1.0.0',
      apis: [
          path.join(__dirname, '../controller/*.js')
      ],
      routerPath: '/api-docs'
    }
  }
}


module.exports = {
  CONFIG
}


