# undb

[![npm](https://img.shields.io/npm/v/undb.svg)](https://www.npmjs.com/package/undb)

Simple JSON in-memory auto-persistent database for server and client.

## Features

* Simple JS object, no extraneous API
* Auto-persisted using [proxy-observe]
* Saves to a json file on server, and uses [localforage] in browser
* `onChange` callback to re-render your app

<small>**Note: Uses ES6 features ([Proxy][proxy-support]), use only where browser/env supports it.** </small>


## Install

```sh
npm i undb
```

## Usage

```js
import undb from 'undb';

undb({
  path: './store.json', /* in node */
  path: 'namespace',    /* in browser */
  initial: {
    something: false
  }
}).then(db => {
  db.something = 'true' // auto-saves
})
```

## API

`undb(options).then(db => {...})`

* **`options`**

  * **`path`** `[string]` Path to use for persistence. Should be a filename on server, and a "namespace" on client.
  * **`initial`** `[object]` Initial database structure
  * **`onChange`** `[function]` Function called whenever database changes
  * **`debounce`** `[number]` [Debounce] `onChange`

* **`db`** Deeply observed js object that triggers auto-save feature when modified


## Examples

Using as a store in a React app

```js
import React from 'react';
import undb from 'undb';

const App = (props) => [
  <h1>Hello {props.store.name}!</h1>,
  <input onChange={e => props.store.name = e.target.value}>
]

const render = (store) => {
  const div = document.getElementById('app');
  React.render(<App store={store}>, div);
}

undb({onChange: render}).then(render);
```

## Libraries used

* **[proxy-observe]**
* **[localforage]**
* **[debounce]**

[proxy-observe]: https://github.com/anywhichway/proxy-observe
[localforage]: https://github.com/localForage/localForage
[debounce]: https://github.com/component/debounce

[ES Proxy]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[proxy-support]: http://caniuse.com/proxy
