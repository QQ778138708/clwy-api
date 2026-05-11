"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "分类名称必须填写" },
          notEmpty: { msg: "分类名称不能为空" },
          len: { args: [2, 45], msg: "分类名称长度必须在2到45之间" },
          async isUnique(value) {
            const category = await sequelize.models.Category.findOne({
              where: { name: value },
            });
            if (category) {
              throw new Error("分类名称已存在");
            }
          },
        },
      },
      rank: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        validate: {
          notNull: { msg: "分类排名必须填写" },
          notEmpty: { msg: "分类排名不能为空" },
          min: { args: [1], msg: "分类排序必须大于等于1" },
        },
      },
    },
    {
      sequelize,
      modelName: "Category",
      paranoid: true,
      timestamps: true,
      deletedAt: "deletedAt",
    },
  );
  return Category;
};
