module.exports = (onChange, component, { Component, createElement, h = createElement, ...opts }) => class extends Component {
  render() {
    return h(component);
  }
  componentDidMount() {
    if (opts.sync) {
      this.removeOnChange = onChange(this.setState);
    } else {
      this.removeOnChange = onChange(state => setTimeout(() => this.setState(state)));
    }
  }
  componentWillUnmount() {
    this.removeOnChange();
  }
};
