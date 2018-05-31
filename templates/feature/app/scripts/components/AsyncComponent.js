import { Component as PreactComponent, h } from 'preact';

function resolve(m) {
  return m && m.default ? m.default : m;
}

function asyncComponent(importComponent) {
  return class extends PreactComponent {
    constructor() {
      super();

      this.state = { component: null };
    }

    componentDidMount() {
      importComponent().then(component =>
        this.setState({ component: resolve(component) })
      );
    }

    render() {
      const { component: Component } = this.state;

      return Component ? <Component {...this.props} /> : null;
    }
  };
}

export default asyncComponent;
