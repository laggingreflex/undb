const undb = require('.');

module.exports = ({ h, Component }) => class extends Component {
  componentWillMount() {
    const db = undb(Object.assign({ onChange: db => this.setState({ db }) }, this.props));
  }
  getChildContext() {
    return this.state;
  }
  render() {
    return h('div', { class: ['undb'] }, this.props.children);
  }
}
