# undb [![npm-shield]][npm]

Simple JSON in-memory auto-persistent database for server and client.

## Features

* Simple JS object, no extraneous API
* Auto-persisted using **[on-change]**
* Saves to a json file on server, and uses **[localStorage]** in browser
* Works in browser, with React or Preact, or without

<small>Note: Uses ES6 features ([Proxy][proxy-support]), use only where browser/env supports it</small>

<small>**Note: API slightly changed from v0.8, please re-read the doc** </small>

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

```js
const undb = require('undb')
const [db, onChange] = undb(options)
```

* **`db`** Deeply observed JS object that triggers auto-save feature when modified

* **`onChange`** `[function]` Called whenever `db` changes

* **`options`**

  * **`path`** `[string]` Path to use for persistence. Should be a filename on server, or a "namespace" on client

  * **`initial`** `[object]` Initial database structure

  * **`debounce`** `[number]` [Debounce] `onChange`

  * **`before`** `[boolean]` Make `onChange` fire *before* the value has been updated in `db`

  * **`read`** `[defaultReader=>object]` Intercept the read function. Must return a data object

  * **`write`** `[defaultWriter=>{}]` Intercept the write function. Must call `defaultWriter`


```jsx
const connect = require('undb/react') // OR
const connect = require('undb/preact')
const ReactiveComponent = connect(onChange)(<Component>)
```
* **`ReactiveComponent`** Component that re-renders `<Component>` whenever `onChange` is fired


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
    const connect = require('undb/react')

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

## Similar libraries

* [mobx](https://github.com/mobxjs/mobx)
* [react-easy-state](https://github.com/solkimicreb/react-easy-state)


[ES Proxy]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[proxy-support]: http://caniuse.com/proxy
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[on-change]: https://github.com/sindresorhus/on-change
[debounce]: https://github.com/component/debounce

[npm]: https://www.npmjs.com/package/undb
[npm-shield]: https://img.shields.io/npm/v/undb.svg
