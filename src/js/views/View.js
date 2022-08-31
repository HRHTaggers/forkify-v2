import icons from "url:../../img/icons.svg";

export default class View {
  _data;

  render(data, render = true) {
    if(!data || (Array.isArray(data) && data.length === 0)) 
        return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if(!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  update(data) {

    this._data = data;
    const newMarkup = this._generateMarkup();    

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll(`*`));
    const currentElements = Array.from(this._parentElement.querySelectorAll(`*`));

    newElements.forEach((newElements, i) => {
      const currentEl = currentElements[i];

      if(!newElements.isEqualNode(currentEl) && newElements.firstChild?.nodeValue.trim() !== ``) {
        currentEl.textContent = newElements.textContent;
      }

      if(!newElements.isEqualNode(currentEl))
        Array.from(newElements.attributes).forEach(attribute => currentEl.setAttribute(attribute.name, attribute.value));

    });
  }

  _clear() {
    this._parentElement.innerHTML = ``;
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="src/img/icons.svg#icon-loader"></use>
          </svg>
        </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="src/img/icons.svg#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }

  renderSuccess(message = this._successMessage) {
    const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="src/img/icons.svg#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
}
