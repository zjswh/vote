const path = require('path')

module.exports = {
  redis: {
      password: "ZvZg2R8L8rbg9y",
      host: "121.42.227.165",
      port: "mysql"
  },

  mysql : {
    development: {
      username: "kkyoo",
      password: "kkyoo_aodian_2011_06_11",
      database: "broadcast_cloud",
      host: "121.42.227.165",
      dialect: "mysql"
    },
    test: {
      username: "kkyoo",
      password: "kkyoo_aodian_2011_06_11",
      database: "broadcast_cloud",
      host: "121.42.227.165",
      dialect: "mysql"
    },
    production: {
      username: "kkyoo",
      password: "kkyoo_aodian_2011_06_11",
      database: "broadcast_cloud",
      host: "121.42.227.165",
      dialect: "mysql"
    }
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


