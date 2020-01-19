'use strict';
module.exports = (sequelize, DataTypes) => {
  const lps_soldier = sequelize.define('lps_soldier', {
    name: DataTypes.STRING,
    childAccount: DataTypes.STRING,
    account: DataTypes.BIGINT,
    mcsId: DataTypes.BIGINT,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    uin: DataTypes.BIGINT,
    aid: DataTypes.BIGINT,
    createTime: DataTypes.BIGINT,
    updateTime: DataTypes.BIGINT,
    userHeadImg: DataTypes.STRING,
    isLogin: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER,
    registerType: DataTypes.INTEGER,
    editor: DataTypes.STRING,
    email: DataTypes.STRING,
    cid: DataTypes.INTEGER,
    lastLoginTime: DataTypes.BIGINT,
    isLiving: DataTypes.INTEGER,
    liveSetting: DataTypes.STRING,
    userId: DataTypes.STRING,
    companyId: DataTypes.STRING,
  }, 
  {
    freezeTableName : true,
    timestamps : false
  });
  lps_soldier.associate = function(models) {
    // associations can be defined here
    lps_soldier.hasOne(models.user,{
      as :'auser',
      foreignKey : 'uin',
      onDelete : 'NO ACTION'
    })
  };
  return lps_soldier;
};