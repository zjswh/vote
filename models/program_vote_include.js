'use strict';
module.exports = (sequelize, DataTypes) => {
  const program_vote_include = sequelize.define('program_vote_include', {
    vote_id: DataTypes.BIGINT,
    include_id: DataTypes.BIGINT,
    type: DataTypes.STRING,
    title: DataTypes.STRING,
    link: DataTypes.STRING,
    version: DataTypes.INTEGER
  }, {
    freezeTableName : true,
    timestamps : false
  });
  program_vote_include.associate = function(models) {
    // associations can be defined here
  };
  return program_vote_include;
};