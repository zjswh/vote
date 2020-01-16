const Joi = require('joi')

module.exports = {
    create : {
        body : {
            topic : Joi.string().required(),
            vote_intro : Joi.string().required(),
            vote_type : Joi.number().required(),
            vote_way : Joi.number().required(),
            vote_choose_num : Joi.number().required(),
            start_time : Joi.string().required(),
            end_time : Joi.string().required(),
            is_rank : Joi.number().required(),
            content : Joi.string().required()
        }
    },
    update : {
        body : {
            id : Joi.number().required(),
            topic : Joi.string().required(),
            vote_intro : Joi.string().required(),
            vote_type : Joi.number().required(),
            vote_way : Joi.number().required(),
            vote_choose_num : Joi.number().required(),
            start_time : Joi.string().required(),
            end_time : Joi.string().required(),
            is_rank : Joi.number().required(),
            content : Joi.string().required()
        }
    },
    getList : {
        query : {
            topic : Joi.string(),
            page : Joi.number(),
            num : Joi.number()
        }
    },
    getContent : {
        query : {
            id : Joi.number().required()
        }
    },
    getRankAdmin : {
        query : {
            id : Joi.number().required()
        }
    },
    getVoteDetailByWay : {
        query : {
            content_id : Joi.number().required()
        }
    },
    getOptionVoteDetail : {
        query : {
            optionId : Joi.number().required(),
            phone : Joi.string(),
            userNick : Joi.string(),
            start_time : Joi.string(),
            end_time : Joi.string(),
            page : Joi.number(),
            num : Joi.number()
        }
    },
    saveConfig: {
        body : {
            include_id: Joi.number().required(),
            type: Joi.string().required(),
        }
    },
    getIncludeFromVoteId: {
        query : {
            vote_id : Joi.number().required(),
            page : Joi.number(),
            num : Joi.number()
        }
    },
    getInfoByInclude : {
        query : {
            include_id: Joi.number().required(),
            type: Joi.string().required(),
        }
    },
    getInfoById : {
        query : {
            id : Joi.number().required()
        }
    },
    userVote : {
        body : {
            id: Joi.number().required(),
            vote_id: Joi.number().required(),
        }
    }
}