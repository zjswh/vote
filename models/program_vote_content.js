'use strict';
module.exports = (sequelize, DataTypes) => {
  const program_vote_content = sequelize.define('program_vote_content', {
    vote_id: DataTypes.BIGINT,
    state: DataTypes.INTEGER,
    title: DataTypes.STRING,
    intro: DataTypes.STRING,
    pic: DataTypes.STRING,
    vote_num: DataTypes.BIGINT,
    sort: DataTypes.INTEGER,
    videoUrl: DataTypes.STRING,
    videoCoverImg: DataTypes.STRING,
    create_time: DataTypes.DATE,
    update_time: DataTypes.DATE
  }, {
    freezeTableName : true,
    timestamps : false
  });
  program_vote_content.associate = function(models) {
    // associations can be defined here
  };

  program_vote_content.getContentInfo = async (id)=>{
    let list = await program_vote_content.findAll({
        where : {
            vote_id : id,
            state : 1
        },
        order : [['sort', 'ASC'],['id', 'ASC']]
    })
    return list
  }

  return program_vote_content;
};