# 使用官方 Node.js 镜像作为基础镜像
FROM node:lts-slim

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /usr/src/app

# 配置 npm 源为淘宝源
RUN npm config set registry https://registry.npmmirror.com

# 复制 package.json 和 package-lock.json（如果存在）并安装依赖
COPY package*.json ./

RUN npm install

# 复制应用程序源代码到容器中
COPY . .

# 构建应用程序
RUN npm run build

# 暴露 NestJS 应用程序运行时的端口
EXPOSE 3000

# 定义默认的运行命令
CMD ["npm", "run", "start:prod"]