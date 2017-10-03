const { h, render } = require('preact');
const undb = require('../..');

const App = props => h('div', {}, [
  h('p', {}, [props.store.text]),
  h('input', {
    value: props.store.text,
    oninput: e => props.store.text = e.target.value,
  }),
]);

const renderApp = store => {
  const div = document.getElementById('app');
  render(h(App, { store }), div, div.lastChild);
};

undb({
  path: 'v1',
  onChange: renderApp,
}).then(renderApp);
