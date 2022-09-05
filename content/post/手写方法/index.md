---
author: NoManPlay
title: 手写方法
description:
date: 2022-07-04
tags: ['手写方法']
categories: ['手写方法', '学习总结']
lastMod: 2022-09-05
---

## 手写 Object.create

将传入的对象作为原型

```javascript
function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}
```

## 手写 instanceof

`instanceof` 运算符用于判断构造函数的 `prototype` 属性是否出现在对象的原型链中的任何位置
实现步骤：

1. 首先获取类型的原型
2. 然后获得对象的原型
3. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 `null`，因为原型链最终为 `null`

```javascript
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left), // 获取对象的原型
    prototype = right.prototype // 获取构造函数的 prototype 对象

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  while (true) {
    if (!proto) return false
    if (proto === prototype) return true

    proto = Object.getPrototypeOf(proto)
  }
}
```

## 手写 new

在调用 `new` 的过程中会发生以上四件事情：

1. 首先创建了一个新的空对象
2. 设置原型，将对象的原型设置为函数的 `prototype` 对象。
3. 让函数的 `this` 指向这个对象，执行构造函数的代码（为这个新对象添加属性）
4. 判断函数的返回值类型，如果是值类型，返回创建的对象。如果是引用类型，就返回这个引用类型的对象

```javascript
function myNew() {
  let newObj = null
  let constructor = Array.prototype.shift.call(arguments)
  let result = null

  // 判断参数是否是一个函数
  if (typeof constructor !== 'function') {
    throw new Error('请传入一个函数')
  }

  //新建一个空对象，对象的原型为构造函数的prototype对象
  newObj = Object.create(constructor.prototype)
  //将this指向新创建的对象，并调用构造函数
  result = constructor.apply(newObj, arguments)
  //判断构造函数是否返回了一个对象
  let flag = result && (typeof result === 'object' || typeof result === 'function')
  //判断返回结果
  return flag ? result : newObj
}

//使用方法
function Car(make, model, year) {
  this.make = make
  this.model = model
  this.year = year
}

const car1 = myNew(Car, 'Ford', 'Focus', '2015')

console.log(car1.make)
```

## 手写 Promise

```javascript
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  status = PENDING
  value = null
  reason = null
  onFulfilledCallbacks = []
  onRejectedCallbacks = []

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach((callback) => callback(value))
    }
  }

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach((callback) => callback(reason))
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }

    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      switch (this.status) {
        case PENDING:
          this.onFulfilledCallbacks.push(fulfilledMicrotask)
          this.onRejectedCallbacks.push(rejectedMicrotask)
          break
        case FULFILLED:
          fulfilledMicrotask()
          break
        case REJECTED:
          rejectedMicrotask()
          break
        default:
          break
      }
    })

    return promise2
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(callback) {
    return this.then(
      (value) => MyPromise.resolve(callback()).then(() => value),
      (reason) =>
        MyPromise.resolve(callback()).then(() => {
          throw reason
        })
    )
  }

  static resolve(parameter) {
    if (parameter instanceof MyPromise) {
      return parameter
    }
    return new MyPromise((resolve) => {
      resolve(parameter)
    })
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }

  static all(promises) {
    const result = []
    let count = 0
    return new MyPromise((resolve, reject) => {
      const addData = (index, value) => {
        result[index] = value
        count++
        if (count === promises.length) resolve(result)
      }

      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (value) => {
              addData(index, value)
            },
            (reason) => {
              reject(reason)
            }
          )
        } else {
          addData(index, promise)
        }
      })
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => resolve(res),
            (err) => reject(err)
          )
        } else {
          resolve(promise)
        }
      })
    })
  }

  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      const res = []
      let count = 0
      const addData = (status, value, index) => {
        res[index] = {status, value}
        count++
        if (count === promises.length) {
          resolve(res)
        }
      }

      promises.forEach((promise, index) => {
        if (promise instanceof MyPromise) {
          promise.then(
            (res) => addData(FULFILLED, res, index),
            (err) => addData(REJECTED, err, index)
          )
        } else {
          addData(FULFILLED, promise, index)
        }
      })
    })
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      let count = 0
      promises.forEach((promise) => {
        promise.then(
          (res) => resolve(res),
          (err) => {
            count++
            if (count === promises.length) {
              reject(new Error('All promises were rejected'))
            }
          }
        )
      })
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))

  if (x instanceof MyPromise) {
    x.then(resolve, reject)
  } else {
    resolve(x)
  }
}
```

## 手写防抖 debounce

函数防抖是指在事件被触发 n 秒后再执行回调，如果在这 n 秒内事件又被触发，则重新计时。这可以使用在一些点击请求的事件上，避免因为用户的多次点击向后端发送多次请求。

```javascript
function debounce(fn, wait) {
  let timer = null
  return function () {
    let context = this
    let args = arguments

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    timer = setTimeout(() => {
      fn.apply(context, args)
    }, wait)
  }
}
```

## 手写节流 throttle

```javascript
function throttle(fn, delay) {
  let curTime = Date.now()

  return function () {
    let context = this
    let args = arguments
    let nowTime = Date.now()

    if (nowTime - curTime >= delay) {
      curTime = Date.now()
      return fn.apply(context, args)
    }
  }
}
```

## 手写类型判断

```javascript
function getType(value) {
  if (value === null) return value + ''
  if (typeof value === 'object') return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
  else return typeof value
}
```

## 手写 call

```javascript
Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  let args = [...arguments].slice(1)
  let result = null

  context = context || window
  context.fn = this
  result = context.fn(...args)
  delete context.fn
  return result
}
```

## 手写 apply

```javascript
Function.prototype.myApply = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }

  let result = null
  context = context || window
  context.fn = this

  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}
```

## 手写 bind

```javascript
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  let args = [...arguments].slice(1)
  let fn = this

  return function Fn() {
    return fn.apply(this instanceof Fn ? this : context, args.concat(...arguments))
  }
}
```

## 柯里化实现

```javascript
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args)
}
```

## 手写发布订阅模式

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
