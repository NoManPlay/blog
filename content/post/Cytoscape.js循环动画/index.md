---
author: NoManPlay
title: Cytoscape.js循环动画
description: Cytoscape.js实现循环动画
date: 2023-03-01
tags: ['Cytoscape.js']
categories: ['学习总结']
lastmod: 2023-03-01
---

# Cytoscape.js 实现循环动画

## 获取 cytoscape 实例

```javascript
const cytoscape = require('cytoscape')

let cy = cytoscape({
  //...
})
```

## 获取对应动画节点

有很多方法 具体参照[官方文档](https://js.cytoscape.org/)

## 设置动画

以 node 为例

```javascript
let nAni = node.animation({
  style: {'border-color': '#2b9af3', 'border-width': 3},
  duration: 500,
})

let loopAni = () => nAni.reverse().rewind().play().promise('completed').then(loopAni)

loopAni()
```
