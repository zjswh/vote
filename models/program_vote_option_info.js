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
  
  return program_vote_option_info;
};