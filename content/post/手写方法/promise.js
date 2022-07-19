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
        res[index] = { status, value }
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
