<p align="center">
  <img alt="Banana.js logo character" src="assets/logo.png" width="200" style="display:block; margin-inline: auto" />
</p>

# Banana.js

Banana is a front-end JavaScript framework for adding interactivity to server-driven websites (Think: Astro, HTMX, eCommerce Themes, HTML templates, etc.) 

Banana aims to be easily integrated into existing projects, and is mostly unopinionated about state management, templating, or styling, allowing you to pick and choose what works best for your project!

Banana provides composable primitives, when combined together allow you to create complex and powerful behaviors.

Banana is fun and natural to use! We provide handy constructs that try to leverage your existing knowledge of JavaScript, to be easily comprehensible, yet powerful.


## Quick, Basic Walkthrough

The following are examples of different ways to create a simple counter component, with each example showing off how Bananas constructs build upon your first JavaScript intuition.

This is the server-rendered markup that we will add interactivity to:
```html
<count>0</count>
```

### Vanilla JS
```js
  const count = document.querySelector('count')
  
  count.addEventListener('click', () => {
    count.innerText++
  })
```
This vanilla JavaScript example, is probably how most would approach this, but it comes with some well-known inconveniences, that have to be manually handled. Things like: ensuring the code only runs after the DOM has loaded, or allowing the reuse of this code for multiple counters. Banana solves these problems for you, by providing a simple API that allows you to create reusable components.

### Create component, add event listener
Here is that same counter, rewritten to use Banana's createComponent, which will run on DOM load, bind to the `count` element, and add the onclick event listener.
```js
import { createComponent, on } from 'banana.js'

const counter = createComponent('count', () => {
  on('click', (e) => {
    e.target.innerText++
  })
})
```
So far it doesn't look like much, and it's not. But thats a good thing! It's easily comprehensible. 
However, this example doesn't really show off the benefits of Banana over Vanilla JavaScript. 

### Move state out of the DOM
In the previous example, the state of the component is stored inside the DOM. This can make sense for a simple counter, but can be a pain to manage for more complex components.

In this example, we introduce the concept of a state object, which is a simple object that lives outside of the DOM, and is unique for each instance of the component.
```js
import { createComponent, on, state } from 'banana.js'

const counter = createComponent('count', () => {
  let state = state() // State returns an object that is unique to this component instance

  on('click', (e) => {
   state.count ||= 0 
   state.count++

   e.target.innerText = state.count
  })
})
```

However, this example isn't ideal, as we still have to manually handle updating the state, and DOM in the event listener.

### Mount, handle state
In this example, we introduce the concept of a mount function, which is a function that runs after the component is mounted to the DOM, and move the state handling into the state object itself, when the dom is updated
```js
import { createComponent, on, state, mount } from 'banana.js'

const counter = createComponent('count', () => {
  let state = state()

  // mount((element) => { // Hopefully we wont need this..
    Object.defineProperty(state, 'count', {
      get: () => state.count || 0,
      set: (value) => {
        state.count = value
        element.innerText = value
      }
    })
  // })

  on('click', (e) => {
    state.count++
  })
})
```
<!-- Using the this could be more simply written as: -->

### Using el
Instead of managing the initial state in `mount` helper, the `state` helper allows one to define the initial state of the component, and add dynamic fields to the state object, however to update the innerText of the element, we are going to need a reference to the element. Thats where the `el` helper comes in. When called, it gets the element that the component is mounted to.

```js
import { createComponent, on, state, el } from 'banana.js'

const counter = createComponent('count', () => {
  let state = state({
    get count() {
      return state.count || 0
    }, 
    set count(value) {
      state.count = value
      el().innerText = value
    }
  })

  on('click', (e) => {
    state.count++
  })
})

```

### Using values
Adding dynamic fields to the state object is a fairly common use-case, and can be a pain to manage. Banana provides a `value` helper to do just that.

```js
import { createComponent, on, state, value } from 'banana.js'

const counter = createComponent('count', () => {
  let state = state()

  let count = value('count', () => {
    initial(0)

    set((old) => {
      return old + 1
    })

    set(() => {
      self(old => old + 1)
    })
  }{
    value: 0,
    get: () => this.value || 0,
    //get: () => state.count || 0,
    set: (updated) => {
      this.value = updated
      //state.count = updated
      el().innerText = updated
    }
  })
  // count() will get
  // count('value') will set
  // count(() => will update)

  on('click', (e) => {
    state.count++
    count(old => old + 1)
  })
})

```

### Bind


```js
import { createComponent, on, state, bind } from 'banana.js'

const counter = createComponent('count', () => {
  let state = state()

  let count = bind('count')

  on('click', (e) => {
    state.count++
    count(old => old + 1)
  })
})

```


Still interested? Read a full tutorial [here](https://github.com/banana-js/banana-docs/blob/master/docs/tutorial.md)





## Prior Art
Inspired by Corset, Hooked-Elements, Surreal


## FAQ

### What isn't this good for?
Banana does not have a build step, a robust templating system, or hydration, and is instead a traditional JavaScript library ala jQuery. Because of this, it probably isn't the best for client-rendered SPAs.

### What do you mean by: _Server-driven websites_?
I mean sites whose HTML is rendered on the server, and require little interactivity or client-side routing.

### Why?
Because I wanted to. I wanted a declarative, component centered library to handle simple, common use-cases, that kept state in JavaScript, and found the current offerings in that area did not fit my taste.




# Notes
get counter
```js
const createCounter = (start) => createComponent(`counter:${start}`, () => {
  template(`<h1> Counter </h1>`)
})


findAll((component) => {
  component.name
  true
})
const counter = createCounter(5)
counter(5).template
counter()

const counters = createComponents(() => {
  key(() => {

  })
}, () => {
  template(`<h1> Counter ${key}</h1>`)
})

counters('key1').template




```



only run the createComponent function once something matches the selector 

```js 
createComponent('counter', ()=>{}) 
createComponent(/regex/, ()=>{}) 
createComponent({
  name,
  selector,
  key,
}, ()=>{}) 
createComponent(() => {
  name('counter')
  el()
  key()
  type()
  attachEvents(false)
  attachState()

  // I dont think this is necessary, maybe it can be done in the mount fn?
  // const hydrate = getHydrate()

  // // calling hydrate will call mounting fn 

  // hydrateWhen('loaded', '')

  return undefined // to handle hydration yourself
  return false
}, ()=>{}) 

```


have pub sub, with the on, can filter with fn or regex, can set where to bind to in a fn in first arg

```js
on(() => {
  event() 
  type('attribute | event | property | value | pubsub')

  return /^cool.test(event().name)

  return false
}, )

// below compiles to the above ^
subscribe(/^cool/ =>{

})

```



state is attached to the element

```js

createComponent('counter', ()=>{
  let state = state({count: 0})
  let count = bind(() => {
    type(attribute | innerText etc)
    name('count')
    get()
    set()
  })
}) 

document.querySelector('counter').count


```

listening to attribute changes will require a mutation observer
```js
createComponent('counter', ()=>{
  let hello  = attr('hello', () => {
    get()
    set()
  })


  cleanup(() => {

  })

})

```

can add props / methods to the dom object itself

have a `createMountable` fn to create a component that can be manually passed an element

```js
const list_holder = createMountable((args) => {
  mount(() => {
    // like the body of a normal fn?
  })

  update((new_state) => {

  })

  template(`${args.map(arg => arg.template('hello'))}`)
})

list_holder([]).mountSelf()(list_holder([])
  .bake())

list_holder([])
  .mount(document.getElementById('main'))
  .update(['one', 'two', 'three'])

```
---


This repo is a template for quickly getting a Typescript npm package up and running.

This example project exports a package for adding and subtract numbers. 

To get started you can delete everything inside the src folder except for index.ts, this is the entry point for the package.

> When you are ready to build this package, make sure you search for the phrase 'my-lib' and replace this with the name of your package.

## Tech Stack

- Vite
- Vitest 
- Typescript

It includes test examples using vite test


# COMMANDS
## run build for local dist testing
npm run build

## run tests
npm run test

## check test coverage
npm run coverage

## build npm release package
npm pack

## Dry run the npm release package
npm pack --dry-run

## run eslint 
npm run lint

## run and fix eslint issues found
npm run lint-and-fix

## run prettier on your files
npm run pretty

## clean up the codebase by runnning eslint and prettier
npm run clean-up


## Semantic Release
This project already has semantic-release as a dependecy. To get the full benifits of this all commit messages should be in the format it requires. You can see that in their readme [here](https://github.com/semantic-release/semantic-release)

The next step is for your CI to be setup to use semantic-release. You can read how to do that [here](https://github.com/semantic-release/semantic-release/blob/HEAD/docs/usage/getting-started.md#getting-started)

# Things to know when publishing your package to github.

1. Set up your repository url inside your package.json set up correctly. 

```
"repository": {
    "type": "git",
    "url": "https://github.com/ageddesi/vite-ts-package-starter.git"
  },
```

2. Update publishConfig so it is pointing to the github package repository

```
"publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
```

3. If you are part of an organization on github, make sure you have that organization alias in your package.json name eg.

```
"name": "@org-alias/ts-npm-package-boilerplate",
```

If you are also using our github workflow to publish the package, you will need to update the registry defintion with the scope. 

Replace.

```
with:
    node-version: 16
    registry-url: https://npm.pkg.github.com/
```

with

```
with:
    node-version: 16
    registry-url: https://npm.pkg.github.com/
    scope: '@org-alias/'
```


4. If you are using our workflow to build and deploy to github you will need to first create a secret key and attach it to your repo with the following name.

```
secrets.GITHUB_TOKEN
```