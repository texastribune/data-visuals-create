import { Component, h, render } from 'preact';

class Portal extends Component {
  componentDidMount() {
    this.renderPortal();
  }

  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    } else {
      // Unmount the children rendered in custom node
      render(null, this.props.node, this.portal);
    }

    this.defaultNode = null;
    this.portal = null;
  }

  componentDidUpdate() {
    this.renderPortal();
  }

  renderPortal() {
    if (!this.props.node && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      document.body.appendChild(this.defaultNode);
    }

    const children = this.props.children;

    this.portal = render(
      (children && children[0]) || null,
      this.props.node || this.defaultNode,
      this.portal
    );
  }

  render() {
    return null;
  }
}

export default Portal;
