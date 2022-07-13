---
author: NoManPlay
title: 手写发布订阅模式
description: 手写发布订阅模式EventEmitter
date: 2022-07-04
tags: ['方法']
categories: ['手写方法', '学习总结']
lastMod: 2022-07-05
---

```javascript
class EventEmitter {
  constructor() {
    this.events = {}
  }

  //订阅
  on(eventName, callback) {
    //新事件触发newListener
    if (!this.events[eventName]) {
      if (this.eventName !== 'newListener') {
        this.emit('newListener', eventName)
      }
    }

    // 由于一个事件可能注册多个回调函数，所以使用数组来存储事件队列
    const callbacks = this.events[eventName] || []
    callbacks.push(callback)
    this.events[eventName] = callbacks
  }

  //单次订阅
  once(eventName, callback) {
    // 由于需要在回调函数执行后，取消订阅当前事件，所以需要对传入的回调函数做一层包装,然后绑定包装后的函数
    const one = (...args) => {
      callback(...args)
      this.off(eventName, one)
    }

    one.initialCallback = callback
    this.on(eventName, one)
  }

  //发布
  emit(eventName, ...args) {
    const callbacks = this.events[eventName] || []
    callbacks.forEach((cb) => cb(...args))
  }

  //取消订阅
  off(eventName, callback) {
    //防止newListener被关闭
    if (eventName === 'newListener') return

    //关闭对应callback
    const callbacks = this.events[eventName] || []
    const newCallbacks = callbacks.filter(
      (fn) => fn != callback && fn.initialCallback != callback /* 用于once的取消订阅 */
    )
    this.events[eventName] = newCallbacks
  }
}

const events = new EventEmitter()

//newLister用于监听新事件
events.on('newListener', function (eventName) {
  console.log(`eventName`, eventName)
})

events.on('hello', function () {
  console.log('hello')
})
console.log('------')

let cb = function () {
  console.log('cb')
}
events.on('hello', cb)
function once() {
  console.log('once')
}
events.once('hello', once)
events.emit('hello')

console.log('------')
events.off('hello', cb)
events.off('hello', once)
events.emit('hello')
```
