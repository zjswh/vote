'use strict';
module.exports = (sequelize, DataTypes) => {
  const program_vote_option_info = sequelize.define('program_vote_option_info', {
    userNick: DataTypes.STRING,
    userId: DataTypes.BIGINT,
    phone: DataTypes.STRING,
    userHeadImg: DataTypes.STRING,
    optionId: DataTypes.BIGINT,
    uin: DataTypes.BIGINT,
    loginType: DataTypes.STRING,
    voteId: DataTypes.BIGINT,
    voteTime: DataTypes.BIGINT,
    type: DataTypes.STRING
  }, {
    freezeTableName : true,
    timestamps : false
  });
  program_vote_option_info.associate = function(models) {
    // associations can be defined here
  };

  program_vote_option_info.getList = async (where,page,num) => {
    const limit = parseInt(num)  || 10
    const offset = (page - 1) * num 
    const list = await program_vote_option_info.findAndCountAll({
      where,
      limit,
      offset,
      attributes : ['id','userNick','userId','phone','userHeadImg',
        'optionId','voteTime','type']
    })
    return list
  }

  return program_vote_option_info;
};