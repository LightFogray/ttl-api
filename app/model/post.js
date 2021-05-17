const moment = require('moment');
module.exports = app => {
  const { STRING,INTEGER,DATE } = app.Sequelize;
  
  const Post = app.model.define('post', {
    pId:{
      type:INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    pContent: {
      type: STRING,
      allowNull: false
    },
    pImgUrl: {
      type: STRING,
      allowNull: true
    },
    uId: {
      type: STRING,
      allowNull:false
    },
    pLikesNum: {
      type: INTEGER,
      default:0
    },
    pCommentsNum: {
      type: INTEGER,
      default:0
    },
    createdAt:{
      type:DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  })
  return Post;
}