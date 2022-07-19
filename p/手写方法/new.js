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
