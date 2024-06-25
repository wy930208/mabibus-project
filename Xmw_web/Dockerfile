# 使用官方的 Nginx 镜像作为基础镜像
FROM nginx:stable-alpine

# 删除默认的 Nginx 网站配置文件
RUN rm -rf /etc/nginx/conf.d/*

# 将本地的 dist 目录中的内容复制到 Nginx 服务器的默认静态文件目录
COPY dist/  /usr/share/nginx/html

# Nginx 配置文件
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 暴露 Nginx 的默认端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]