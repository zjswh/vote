const _ = require('lodash')

module.exports = {
    data : (data = '',code = 200,message = '')=>{
        return {
            data,
            code,
            message
        }
    },
    arrayToObj : (arr) =>{
        if(_.isEmpty(arr)){
            return {}
        }
        const res = _.chunk(arr,2)
        return _.fromPairs(res)
    },
    date : (date,fmt)=>{
        const o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    getIp : req => {
        return req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    },
    modelToJson : model => {
        return JSON.parse(JSON.stringify(model))
    }
}