"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        foreignKey: "userId",
        as: "courses",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "邮箱必须填写" },
          notEmpty: { msg: "邮箱不能为空" },
          isEmail: { msg: "邮箱格式错误" },
          async isUnique(value) {
            const user = await sequelize.models.User.findOne({
              where: { email: value },
            });
            if (user) {
              throw new Error("邮箱已存在");
            }
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "用户名必须填写" },
          notEmpty: { msg: "用户名不能为空" },
          len: { args: [2, 45], msg: "用户名长度必须在2到45之间" },
          async isUnique(value) {
            const user = await sequelize.models.User.findOne({
              where: { username: value },
            });
            if (user) {
              throw new Error("用户名已存在");
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          if (!value) {
            throw new Error("密码不能为空");
          }
          // 密码长度必须在6到20之间
          if (value.length < 6 || value.length > 20) {
            throw new Error("密码长度必须在6到20之间");
          }

          this.setDataValue("password", bcrypt.hashSync(value, 10));
        },
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "昵称必须填写" },
          notEmpty: { msg: "昵称不能为空" },
          len: { args: [2, 45], msg: "昵称长度必须在2到45之间" },
        },
      },
      sex: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          notNull: { msg: "性别必须填写" },
          notEmpty: { msg: "性别不能为空" },
          isIn: { args: [[0, 1, 2]], msg: "性别必须是0、1或2" },
        },
      },
      company: DataTypes.STRING,
      introduce: DataTypes.TEXT,
      role: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: {
          notNull: { msg: "用户组必须填写" },
          notEmpty: { msg: "用户组不能为空" },
          isIn: { args: [[0, 100]], msg: "用户组必须是0、100" },
        },
      },
      avatar: {
        type: DataTypes.STRING,
        validate: {
          isUrl: { msg: "头像格式错误" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
      timestamps: true,
      deletedAt: "deletedAt",
    },
  );
  return User;
};
