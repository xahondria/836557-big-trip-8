class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._fragment = null;
    this._element = null;
    this._state = {};
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  bind() {
  }

  unbind() {
  }

  updateComponent(element) {
    if (element._currentComponent) {
      element._currentComponent.unbind();
    }
    const newElement = this.render();
    element.replaceWith(newElement);
    newElement._currentComponent = this;
    newElement._currentComponent._currentHTMLElement = newElement;
  }

  createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }

  render() {
    this._element = this.createElement(this.template);
    this._element._currentComponent = this;
    this._element._currentComponent._currentHTMLElement = this._element;
    this.bind();
    return this._element;
  }

  unrender() {
    //  TODO написать unrender
  }

}

export default Component;
