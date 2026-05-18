"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Course.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Course.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "分类ID必须填写" },
          notEmpty: { msg: "分类ID不能为空" },
          async isUnique(value) {
            const category = await sequelize.models.Category.findOne({
              where: {
                id: value,
              },
            });
            if (!category) {
              throw new Error("分类ID不存在");
            }
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "用户ID必须填写" },
          notEmpty: { msg: "用户ID不能为空" },
          async isUnique(value) {
            const user = await sequelize.models.User.findOne({
              where: {
                id: value,
              },
            });
            if (!user) {
              throw new Error("用户ID不存在");
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "课程名称必须填写" },
          notEmpty: { msg: "课程名称不能为空" },
          len: { args: [2, 45], msg: "课程名称长度必须在2到45之间" },
        },
      },
      image: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: "图片URL格式错误" },
        },
      },
      recommended: DataTypes.BOOLEAN,
      introductory: DataTypes.BOOLEAN,
      content: DataTypes.TEXT,
      likesCount: DataTypes.INTEGER,
      chaptersCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
      paranoid: true,
      timestamps: true,
      deletedAt: "deletedAt",
    },
  );
  return Course;
};
