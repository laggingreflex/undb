const { Component, createElement: h, } = require('react');

module.exports = (onChange, opts = {}) => component => class extends Component {
  render() {
    const children = Array.isArray(this.children) ? this.children : typeof this.children === 'undefined' ? [] : [this.children];
    return h(component, this.props, ...children);
  }
  componentDidMount() {
    if (opts.sync) {
      this.removeOnChange = onChange(() => this.setState({}));
    } else {
      this.removeOnChange = onChange((s, state) => setTimeout(() => this.setState({})));
    }
  }
  componentWillUnmount() {
    this.removeOnChange();
  }
};
