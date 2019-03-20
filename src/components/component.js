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

  unbind() {
    //  TODO написать unbind
  }

  updateComponent(element) {
    if (element._currentComponent) {
      element._currentComponent.unbind();
    }
    element.replaceWith(this.render());
    element._currentComponent = this;
  }

  createFragment(template) {
    return document.createRange().createContextualFragment(template);
  }

  render() {
    this._fragment = this.createFragment(this.template);
    this._fragment._currentComponent = this;
    this.bind();
    return this._fragment;
  }

  unrender() {
    //  TODO написать unrender
  }

}

export default Component;
