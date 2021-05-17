  
const moment = require('moment');
module.exports = app => {
  const { STRING, INTEGER,DATE } = app.Sequelize;

  const Wxuser = app.model.define('wxuser', {
    id: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    openid: {
      type: STRING,
      allowNull: false
    },
    wxName: {
      type: STRING
    },
    wxAvatarUrl: {
      type: STRING
    },
    wxPenname: {
      type: STRING
    },
    device: {
      type: STRING
    },
    ipAddress:{
      type: STRING
    },
    createdAt: {
      type: DATE,
      allowNull: true,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  });

  return Wxuser;
};