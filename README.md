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