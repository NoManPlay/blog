---
author: NoManPlay
title: 自动化脚本
description: 自动化脚本实现方法
date: 2021-12-23
tags: ['脚本']
categories: ['开发技巧']
lastMod: 2021-12-24
---

# 自动化脚本

## crontab 语法

| 位置 | 含义 | 范围                 |
| ---- | ---- | -------------------- |
| \*   | 分钟 | 0-59                 |
| \*   | 小时 | 0-23                 |
| \*   | 日期 | 1-31                 |
| \*   | 月份 | 1-12                 |
| \*   | 星期 | 0-7(0 和 7 都是周日) |

## 编写 crontab

```bash
crontab -e //编辑crontab
```

- `* * * * *` 自动化执行
- ` path/name.sh` 需要执行的脚本
- `> path/name.txt 2>&1 & ` 将脚本执行后的结果 输入到`name.txt`文件上

```bash
crontab -l //查看crontab

* * * * * path/name.sh > path/name.txt 2>&1 &
```

将会在规定时间时自动执行对应脚本
