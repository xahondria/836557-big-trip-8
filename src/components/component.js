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

  getElement() {
    return this._element;
  }

  getState() {
    return JSON.parse(JSON.stringify((this._state)));
  }

  setState(newState) {
    this._state = newState;
  }

  bind() {
  }

  unbind() {
  }

  updateComponent(element) {
    console.log(element);
    if (element._currentComponent) {
      element._currentComponent.unbind();
    }
    const newElement = this.render();
    element.replaceWith(newElement);
    newElement._currentComponent = this;
    return newElement;
  }

  createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  }

  render() {
    this._element = this.createElement(this.template);
    this._element._currentComponent = this;
    this.bind();
    return this._element;
  }

  renderToTop(container) {
    container.insertBefore(this._element, container.firstChild);
  }

  unrender() {
    this.unbind();
    this._element.remove();
    this._element = null;
  }

}

export default Component;
