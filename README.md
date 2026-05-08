# clwy-api 学习笔记
## 使用 nvm 安装 Node.js
- 下载 `nvm-setup.exe` 并安装，下载地址： https://github.com/coreybutler/nvm-windows/ 。
- 运行 `nvm -v` ，测试安装是否成功。
- 运行 `nvm list available` ，找到最新的 Node.js 长期支持版本号(LTS) 。
- 运行 `nvm install 版本号` ，安装 Node.js 。
- 运行 `nvm use 版本号` ，将这个版本设置为默认版本。
- 运行 `node -v`，查看当前 Node.js 版本号。
- 补充，运行 `nvm list` ，看看现在已经安装了哪些版本的 Node.js 。
- 配置 npm 中国镜像，运行 `npm config set registry https://registry.npmmirror.com/
` 。
## 创建 Express 项目
- 安装 `express-generator` 脚手架，通过它，可以生成项目所需的结构。运行 `npm install -g express-generator` 。
- 运行 `express --no-view my-api ` ，创建项目 my-api ，`--no-view` 表示不需要视图模版，项目名称：my-api 。
- 进入项目目录，运行 `cd my-api` ，运行 `npm i` 安装项目依赖包，运行 `npm start` ，启动服务。
- 通过 `http://localhost:3000/` 来访问刚刚创建的 express 项目。
- 输出 `json` 格式。删除 `public\index.html` ，修改 `routes\index.js` ，重启服务。刷新浏览器，可以看到返回的 `json` 数据。
```javascript
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({message: 'Hello Node.js'});
});

module.exports = router;
``` 
- 每次修改代码后，都需要重启服务，才能让新的代码生效，很麻烦。我们现在来安装 `nodemon` 包来解决这个问题。运行 `npm i nodemon` ，修改 `package.json` ，然后重启服务。
```json
{
  "name": "my-api",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "nodemon ./bin/www"
  },
  "dependencies": {
    "cookie-parser": "~1.4.4",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "morgan": "~1.9.1",
    "nodemon": "^3.1.14"
  }
}
```
## 安装 MySQL
- 购买阿里云服务器，安装宝塔面板。
- 安装 MySQL 5.7.44
## 创建数据库
![](./images/添加mysql数据库（测试用）.png)
- 使用 DBeaver 测试连接。
## 使用 Sequelize ORM
- 安装 `sequelize` 命令行工具，运行 `npm i -g sequelize-cli` 。
- 安装项目依赖的 `sequelize` 包和对数据库支持依赖的 `mysql2` 。运行 `npm i sequelize mysql2` 。
- 初始化项目，运行 `sequelize init` 。
## 模型、迁移与种子
### 数据库配置 config.json
- 刚刚初始化项目后，`config/config.json` 是连接数据库的配置文件。
- 配置好了，Node.js 项目会自动连接到数据库上。
```json
{
  "development": {
    "username": "clwy",
    "password": "clwy1234",
    "database": "clwy_api_development",
    "host": "139.196.78.182",
    "dialect": "mysql",
    "timezone": "+08:00"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```
### 模型
- 运行 `sequelize model:generate --name Article --attributes title:string,content:text
` 。
- 生成模型文件 `models\articles.js` ，添加了 `软删除` 代码。
```javascript
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
        title: DataTypes.STRING,
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
```
### 迁移文件
- 迁移文件 `migrations\20260508021505-create-article.js` 。添加了 `deletedAt` 字段，修改了字段 `id` 和 `title` 。给 `deletedAt` 添加索引 。
```javascript
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Articles', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER.UNSIGNED,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.TEXT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addIndex('Articles', {
            fields: ['deletedAt'],
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Articles');
    }
};
```
### 运行迁移
- 运行 `sequelize db:migrate` 。
- 在 `DBeaver` 中看到，表格 `Articles` 已经生成了。
### 种子文件
- 运行 `sequelize seed:generate --name article` 。
- 修改种子文件，添加测试数据。
- 运行种子文件，运行 `sequelize db:seed --seed 20260508051800-article.js` ，表 `Articles` 中就有数据了。
## 查询文章列表
- 新建一个 `routes\admin` 作为后台路由文件目录。
- 新建后台文章路由 `routes\admin\articles.js` 。
- 在 Apifox 中，get 请求，/admin/articles ，测试。