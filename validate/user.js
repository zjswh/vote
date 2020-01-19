const Joi = require('joi')

module.exports = {
    consoleLogins : {
        body : {
            phone : Joi.number().required(),
            password : Joi.string().required()
        }
    },
    liveLogin : {
        body : {
            phone : Joi.number().required(),
            password : Joi.string().required()
        }
    }
}