'use strict';
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
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
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

  return program_vote;
};