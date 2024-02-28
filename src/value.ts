var ctx = {}
var cur = {}

let value = (name, initialOrFn, fn) => {
  let Fn = fn || initialOrFn
  ctx[name] = {
    value: fn ? initialOrFn : undefined,
  }

  cur=ctx[name]
  Fn()


  function _return (alter) {
    if (!alter) {
      if (ctx[name]?.get?.length) return pipe(ctx[name].get)(ctx[name].value)
      return ctx[name].value
    }
    if (alter instanceof Function) {
      if (ctx[name]?.set?.length) {
        let res = pipe(ctx[name].set)(alter(ctx[name].value))
        ctx[name].value = res 
        return res
      } 
      
      let res = alter(ctx[name].value)
      ctx[name].value = res
      return res
    }

    ctx[name].value = alter
    return ctx[name].value
  }

  for (let [method_name, fn] of Object.entries(cur?.methods || {})) {
    Object.defineProperty(_return, method_name, {value: fn})
  }

  cur = undefined 

  return _return

}

let val = () => {
  return cur.value
}

let self = () => {
  return cur
}

let get = (fn) => {
  cur.get ||= []

  cur.get.push(fn)
}

let set = (fn) => {
  cur.set ||= []
  cur.set.push(fn)
}

let wrap = (fn) => {
  let _cur = cur
  return (...args) => {
    cur = _cur
    let val = fn?.(...args) || fn
    cur = undefined
    return val
  }
}

let method = (name, fn) => {
  cur['methods'] ||= {}
  let wrapped = wrap(fn)
  cur.methods[name] = wrapped
  return wrapped
}

let pipe = (fns) => (...args) => {
  let res = args
  
  for (let fn of fns) {
    res = fn(res)
  }
  return res
}

let count = value('count', 0, () => {
  method('inc', () => {
    self().value += 1
    return val()
  })
})


console.log(ctx.count.methods.inc)
console.log(count.inc())
console.log(count.inc())
console.log(count(arg => arg* 10))
console.log(count())

let inc = count.inc

console.log(inc())