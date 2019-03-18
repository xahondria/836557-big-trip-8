class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._fragment = null;
    this._state = {};
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  bind() {
  }

  updateComponent(element) {
    element.replaceWith(this.render());
  }

  createFragment(template) {
    return document.createRange().createContextualFragment(template);
  }

  render() {
    this._fragment = this.createFragment(this.template);
    this.bind();
    return this._fragment;
  }
}

export default Component;
