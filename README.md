# undb [![npm-shield]][npm]

Simple JSON in-memory auto-persistent database for server and client.

## Features

* Simple JS object, no extraneous API
* Auto-persisted using **[on-change]**
* Saves to a json file on server, and uses **[localStorage]** in browser
* Works in browser, with React or Preact, or without

<small>Note: Uses ES6 features ([Proxy][proxy-support]), use only where browser/env supports it</small>

## Install

```sh
npm i undb
```

## Usage

```js
const undb = require('undb')

const [db, onChange] = undb({
  path: './store.json', /* in node */
  path: 'namespace',    /* in browser */
  initial: {
    something: false
  }
})

onChange(() => {
  // Fires whenever db changes
})

```

## API

### `undb`

```js
const undb = require('undb')

const [db, onChange] = undb(options)
```

* **`db`** Deeply observed JS object that triggers auto-save feature when modified

* **`onChange`** `[fn]` Called whenever `db` changes

* **`options`**

  * **`path`** `[str]` Path to use for persistence. Should be a filename on server, or a "namespace" on client

  * **`initial`** `[obj]` Initial database structure

  * **`clear`** `[bool]` **Deletes** all localstorage items except current path

  * **`debounce`** `[num]` [Debounce] `onChange`

  * **`before`** `[bool]` Make `onChange` fire *before* the value has been updated in `db`

  * **`read`** `[fn=>obj]` Intercept the read function. Must return a data object. `fn` is the default read function

  * **`write`** `[cb=>null]` Intercept the write function. Must call `cb`

### `link`


```js
const { link } = require('undb/common/utils')
const state1Tuple = undb(options)
const state2Tuple = undb(options)
link(state1Tuple, state2Tuple);
```

```js
const { link } = require('undb/common/utils')
const [ state1, state2 ] = link({}, {});
```

```js
const [state1, onChange, link] = undb(options)
const [state2] = link({})
```

* **`link`** `[fn]` Link 2 or more states. Changing one will change the other(s).

    * **`@param {...[state, onChange]|initial}`** Takes either the `[state, onChange]` tuple or an `initial` object to create a new reactive state object from.

    * **`@returns state[]`** Returns an array corresponding to the input arguments, each item either being the input `[state]` (from the tuple) or a newly created one.


### Browser specific

#### `connect`

* **`connect`** `[fn=>fn=>Component]` Connects the **`onChange`** to a `<Component>` so that it re-renders whenever `onChange` is fired

```jsx
const connect = require('undb/browser/connect')

const ReactiveComponent = connect(onChange)(<Component>)
```

#### `useState`

* **`useState`** `[obj=>obj]` [React State Hook][hooks-state] alternative that updates when `state` object is modified

```jsx
const { useState } = require('undb/browser/hooks')

const state = useState({ counter: 0 })
```



## Examples

### Global persistent store

**Note:** Re-renders entire React App

* **`store.js`**

    ```js
    const undb = require('undb')

    const [store, onChange] = undb({ path: 'my-app' })

    exports.store = store
    exports.onChange = onChange
    ```

* **`components/App.js`**

    ```jsx
    const { store } = require('../store')

    module.exports = () => [
      <h1>Hello {store.name}!</h1>,
      <input onChange={e => store.name = e.target.value}>
    ]
    ```

* **`main.js`**

    ```jsx
    const React = require('react')
    const { onChange } = require('./store')
    const App = require('./components/App')

    onChange(() => React.render(<App>))
    ```

### Local volatile state

* **`components/App.js`**

    ```jsx
    const undb = require('undb')
    const connect = require('undb/browser/connect')

    const [state, onChange] = undb()

    const App = () => [
      <h1>Hello {state.name}!</h1>,
      <input onInput={e => state.name = e.target.value}>
    ]

    module.exports = connect(onChange)(App)
    ```

* **`main.js`**

    ```jsx
    const React = require('react')
    const App = require('./components/App')

    React.render(<App>)
    ```

### [React State Hook][hooks-state] Alternative

* **`components/App.js`**

    ```jsx
    const { useState } = require('undb/browser/hooks')

    const App = () => {
      const state = useState({ counter: 0 })
      return (
        <button onClick={ () => state.counter++ }>
          `You have pressed this button ${state.counter} times`
        </button>
      )
    }
    ```

## Similar libraries

* [unurl](https://github.com/laggingreflex/unurl)
* [mobx](https://github.com/mobxjs/mobx)
* [react-easy-state](https://github.com/solkimicreb/react-easy-state)


[ES Proxy]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[proxy-support]: http://caniuse.com/proxy
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[on-change]: https://github.com/sindresorhus/on-change
[debounce]: https://github.com/component/debounce
[hooks-state]: https://reactjs.org/docs/hooks-state.html

[npm]: https://www.npmjs.com/package/undb
[npm-shield]: https://img.shields.io/npm/v/undb.svg
