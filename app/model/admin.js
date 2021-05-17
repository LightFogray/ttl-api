module.exports = app => {
  const { STRING,INTEGER } = app.Sequelize;
  
  const Admin = app.model.define('admin', {
    id:{
      type:INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: STRING,
      allowNull: false
    },
    password: {
      type: STRING,
      allowNull: false
    },
    avatarUrl: {
      type: STRING,
      allowNull:true
    }
  })
  return Admin;
}