module.exports = (onChange, component, { Component, createElement, h = createElement, ...opts }) => class extends Component {
  render() {
    return h(component, this.props, this.children);
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
