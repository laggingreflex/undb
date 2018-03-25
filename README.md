# undb

[![npm](https://img.shields.io/npm/v/undb.svg)](https://www.npmjs.com/package/undb)

Simple JSON in-memory auto-persistent database for server and client.

## Features

* Simple JS object, no extraneous API
* Auto-persisted using [proxy-observe]
* Saves to a json file on server, and uses **[localStorage]** in browser
* `onChange` callback to re-render your app

<small>**Note: Uses ES6 features ([Proxy][proxy-support]), use only where browser/env supports it.** </small>

## Install

```sh
npm i undb
```

## Usage

```js
import undb from 'undb';

const db = undb({
  path: './store.json', /* in node */
  path: 'namespace',    /* in browser */
  initial: {
    something: false
  }
})
```

## API

`const db = undb(options)`

* **`db`** Deeply observed JS object that triggers auto-save feature when modified

* **`options`**

  * **`path`** `[string]` Path to use for persistence. Should be a filename on server, and a "namespace" on client.
  * **`initial`** `[object]` Initial database structure

  * **`onChange`** `[function]` Function called whenever database changes

    ```js
    (db) => {...}
    ```

  * **`debounce`** `[number]` [Debounce] `onChange`

  * **`read`** `[function]` Intercept the read function. E.g. to modify data before initializing (as the deeply observed JS object).

    ```js
    (opts, defaultRead) => { return {...} }
    ```

    * **`opts`** `[object]` Originally passed options
    * **`defaultRead`** `[function]` The default reader function.

      Must **return** a plain data object which will be initialized as the deeply observed JS object.

  * **`write`** `[function]` Intercept the write function. E.g. to modify data before saving.

    ```js
    (db, opts, defaultWrite) => { /* ...write */ return db }
    ```

    * **`db`** `[object]` The deeply observed JS object
    * **`opts`** `[object]` Originally passed options
    * **`defaultWrite`** `[function]` The default writer function.

      If you choose not to use `defaultWrite` you **must** save the data manually.

      Must **return** back the original `db` object (the first argument)


## Examples

Using as a store in a React app:

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

const store = undb({onChange: render});
render(store)
```

Intercepting default read/write functions:

```js
import undb from 'undb';

const db = undb({
  initial: {store: {}, state: {}},

  read: (opts, read) => {

    // read the original DB using the default reader function
    const db = read(opts);

    // attach a custom method
    db.validate = () = {
      if (db.store.user && !db.store.user.name) {
        throw new Error('Invalid data structure');
      }
    };

    // return the modified db object
    return db;
  },

  write: (db, opts, write) => {

    // Convert the deeply observed JS object into plain JS object
    const data = JSON.parse(JSON.stringify(db));
    // This also removes the "validate" function attached above

    // Perform custom operations on data
    data.state = {}; // don't wanna save "state"

    // write the data using the default writer function
    write(data, opts);

    // return the original db
    return db;
  },
});
```



## Similar libraries

* https://github.com/sindresorhus/on-change
* https://github.com/solkimicreb/react-easy-state
* https://github.com/nx-js/observer-util

## Libraries used

* **[proxy-observe]**
* **[debounce]**

[proxy-observe]: https://github.com/anywhichway/proxy-observe
[debounce]: https://github.com/component/debounce

[ES Proxy]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[proxy-support]: http://caniuse.com/proxy
[localStorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
