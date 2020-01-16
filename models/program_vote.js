'use strict';
const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const program_vote = sequelize.define('program_vote', {
    access_id: DataTypes.BIGINT,
    state: DataTypes.INTEGER,
    topic: DataTypes.STRING,
    aid: DataTypes.BIGINT,
    vote_intro: DataTypes.TEXT,
    vote_type: DataTypes.INTEGER,
    vote_way: DataTypes.INTEGER,
    vote_choose_num: DataTypes.BIGINT,
    banner: DataTypes.STRING,
    start_time: {
      type: DataTypes.DATE,
      get() {
          return moment(this.getDataValue('start_time')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    end_time: {
      type: DataTypes.DATE,
      get() {
          return moment(this.getDataValue('end_time')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    is_rank: DataTypes.INTEGER,
    count: DataTypes.BIGINT,
    create_time: DataTypes.DATE,
    update_time: DataTypes.DATE
  }, {
    freezeTableName : true,
    timestamps : false
  });
  program_vote.associate = function(models) {
    // associations can be defined here
  };

  program_vote.getInfo = async (id)=>{
    let info = await program_vote.findOne({
        where : {
            id
        },
        attributes : ['id','access_id','topic','vote_intro','vote_type',
        'vote_way','vote_choose_num','banner','start_time','end_time','is_rank']
    })
    return info
  };

  program_vote.getList = async (where,page,num)=>{
    const limit = parseInt(num)  || 10
    const offset = (page - 1) * num 
    let result = await program_vote.findAndCountAll({
        where,
        limit,
        offset,
        attributes : ['id','access_id','topic','vote_intro','vote_type',
        'vote_way','vote_choose_num','banner','start_time','end_time','is_rank','create_time'],
        order: [['create_time', 'DESC']]
    })
    return result
  };

  return program_vote;
};