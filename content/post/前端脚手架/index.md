---
author: NoManPlay
title: 前端脚手架
description: 前端脚手架
date: 2022-07-11
tags: ['脚手架']
categories: ['开发技巧']
---

# 前端脚手架

## 目的

通过脚手架实现用一行命令导入不同模板：

- PC 端 React
- 移动端 Taro

实现的功能：

- 一条简单的命令初始化项目
- 提供友好的交互体验
- 可选择安装不同模板
- 自动安装项目依赖

## 脚手架开发依赖

- [chalk](https://www.npmjs.com/package/chalk):修改控制台输出内容样式
- [commander](https://www.npmjs.com/package/commander):命令行工具

- [download-git-repo](https://www.npmjs.com/package/download-git-repo):用来下载远程模板
- [inquirer](https://www.npmjs.com/package/inquirer):交互式命令行工具
- [ora](https://www.npmjs.com/package/ora):显示 loading 动画
- [log-symbols](https://www.npmjs.com/package/log-symbols):显示出 √ 或 × 等的图标
- [handlebars.js](https://www.npmjs.com/package/handlebars):模板引擎
