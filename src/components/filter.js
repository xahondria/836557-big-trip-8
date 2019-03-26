import Component from "./component";

class Filter extends Component {
  constructor(data, options = {}) {
    super();
    this._state = {
      id: data.id,
      value: data.value,
      isChecked: data.isChecked,
      isDisabled: data.isDisabled,
      labelText: data.labelText,
    };

    this.onChange = typeof options.onChange === `function` ? options.onChange : () => {};
    this.onChange = this.onChange.bind(this);
  }

  get template() {
    return `
      <input 
        type="radio" 
        id=${this._state.id} 
        name="filter" 
        value=${this._state.value} 
        ${this._state.isChecked}
        ${this._state.isDisabled}
      >
      <label 
        class="trip-filter__item" 
        for=${this._state.id}
      >
        ${this._state.labelText}
      </label>
    `.trim();
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

  bind() {
    this._fragment.querySelector(`#${this._state.id}`)
      .addEventListener(`change`, this.onChange);
  }
}

export default Filter;
