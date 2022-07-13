---
author: NoManPlay
title: 手写InstanceOf
description:
date: 2022-07-08
tags: ['方法']
categories: ['手写方法', '学习总结']
lastMod: 2022-07-08
---

```javascript
function myInstanceOf(L, R) {
  const baseType = ['string', 'number', 'boolean', 'undefined', 'symbol']
  if (baseType.includes(typeof(L))) return false
  if (!R.prototype) return false
  let proto = Object.getPrototypeOf(L)
  let prototype = R.prototype

  while (true) {
    if (proto === null) return false
    if (proto === prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}
```
