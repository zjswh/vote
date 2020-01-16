const redis = require('redis')
const bluebird = require('bluebird')
const {CONFIG} = require('../config/config')
const config = CONFIG.redis

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient(config)

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = client