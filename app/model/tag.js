module.exports = app => {
  const { STRING,INTEGER } = app.Sequelize;
  
  const Tag = app.model.define('tag', {
    id:{
      type:INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tName: {
      type: STRING,
      allowNull: false
    }
  })
  return Tag;
}