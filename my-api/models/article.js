'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {msg:'标题必须填写'},
        notEmpty: {msg:'标题不能为空'},
        len:{args:[2,45],msg:"标题的长度需要在 2 ~ 45 个字符之间"}
      }
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Article',
    paranoid: true, // 开启软删除
    timestamps: true, // 默认为 true，必须开启
    deletedAt:'deletedAt',  // 可选，指定字段名，默认就是 ‘deletedAt’
  });
  return Article;
};