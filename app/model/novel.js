const moment = require('moment');
module.exports = app => {
  const { INTEGER,STRING,DATE } = app.Sequelize;
  const Novel = app.model.define('novel',{
    nId:{
      type:INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    uId:{
      type: STRING,
    },
    nCoverImg:{
      type: STRING,
    },
    nName:{
      type: STRING,
    },
    nIntro:{
      type: STRING,
    },
    nTags:{
      type: STRING,
    },
    nCollectsNum:{
      type: INTEGER,
    },
    nLikesNum:{
      type: INTEGER,
    },
    createdAt:{
      type:DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    status:{
      type:INTEGER,
      default:0
    }
  })
  return Novel;
}