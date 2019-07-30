import BaseComponent from '../base-component';
import defer from 'tools/defer';

import styles from './abstract-input-styles.html';

class AbstractInput extends BaseComponent {
    render(compiler, {unsafeHTML}) {
        const {label = '', disabled, required} = this;
        const {handleInputBlur, handleInputFocus, handleInputInput, handleButtonClick} = this;

        return compiler`
            <link rel="stylesheet" href="css/mdc.textfield.min.css"/>

            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
            
            ${unsafeHTML(styles)}

            <div class="mdc-text-field mdc-text-field--with-trailing-icon ${disabled ? 'mdc-text-field--disabled' : ''}">
                <input class="mdc-text-field__input"
                   ?disabled=${disabled}
                   ?required=${required}
                   @blur=${handleInputBlur}
                   @focus=${handleInputFocus}
                   @input=${handleInputInput}/>
                <label class="mdc-floating-label">${label}</label>
                <i class="material-icons mdc-text-field__icon"
                   tabindex="0"
                   @click=${handleButtonClick}>cancel</i>
                <bld-line-ripple></bld-line-ripple>
            </div>
            <div class="mdc-text-field-helper-line">
                <div class="mdc-text-field-helper-text"></div>
                <div class="mdc-text-field-character-counter"></div>
            </div>
        `;
    }

    onCreate() {
        this.isTouched = false;
        this.hasInitialValue = false;
        this.failedConstraint = null;
        this.setPrivate('rendered', defer());
    }

    onConnect() {
        this.getPrivate('rendered').resolve();
    }

    onRender() {
        this.inputElement = this.shadowRoot.querySelector('.mdc-text-field__input');
        this.labelElement = this.shadowRoot.querySelector('.mdc-floating-label');
        this.helperElement = this.shadowRoot.querySelector('.mdc-text-field-helper-text');
        this.buttonElement = this.shadowRoot.querySelector('.mdc-text-field__icon');
        this.rippleElement = this.shadowRoot.querySelector('bld-line-ripple');
        this.counterElement = this.shadowRoot.querySelector('.mdc-text-field-character-counter');
        this.wrapperElement = this.shadowRoot.querySelector('.mdc-text-field');

        if (!this.hasInitialValue) {
            this.value = '';
        }
    }

    static get observedAttributes() {
        return ['disabled'];
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }

    get required() {
        return Boolean(this.constraints.find(({name}) => name === 'required'));
    }

    get maxLength() {
        const constraint = this.constraints.find(({name}) => name === 'maxlength');

        return constraint && constraint.params[0];
    }

    handleInputBlur() {
        this.isTouched = true;

        this.updateLabel();
        this.updateWrapper({focused: false});
        this.reportValidity();

        this.rippleElement.deactivate();
    }

    handleInputFocus() {
        this.rippleElement.activate();

        this.updateLabel({putAbove: true});
        this.updateWrapper({focused: true});
    }

    handleInputInput() {
        this.validate();
        this.updateButton();
        this.updateCounter();
    }

    handleButtonClick() {
        this.value = '';
        this.isTouched = true;
    }

    get value() {
        return this.inputElement.value;
    }

    set value(value) {
        this.hasInitialValue = true;

        (async () => {
            await this.getPrivate('rendered').promise;

            this.inputElement.value = value;

            this.validate();
            this.updateLabel();
            this.updateButton();
            this.updateCounter();

            this.dispatchEvent(new Event('input'));
        })();
    }

    validate() {
        const {value} = this;

        this.failedConstraint = this.constraints.find(({test}) => !test(value)) || null;

        this.reportValidity();
    }

    get isTouched() {
        return this.getPrivate('isTouched');
    }

    set isTouched(isTouched) {
        this.setPrivate('isTouched', isTouched);
    }

    get failedConstraint() {
        return this.getPrivate('failedConstraint');
    }

    set failedConstraint(failedConstraint) {
        this.setPrivate('failedConstraint', failedConstraint);
    }

    get hasInitialValue() {
        return this.getPrivate('hasInitialValue');
    }

    set hasInitialValue(hasInitialValue) {
        this.setPrivate('hasInitialValue', hasInitialValue);
    }

    reportValidity() {
        const {isTouched, failedConstraint} = this;
        const showInvalidity = Boolean(isTouched && failedConstraint);
        const displayMessage = showInvalidity ? failedConstraint.errorMessage : '';

        this.helperElement.textContent = displayMessage;
        this.helperElement.setAttribute('title', displayMessage);
        this.helperElement.classList.toggle('mdc-text-field-helper-text--validation-msg', showInvalidity);
        this.wrapperElement.classList.toggle('mdc-text-field--invalid', showInvalidity);
    }

    updateLabel({putAbove = this.hasValue} = {}) {
        this.labelElement.classList.toggle('mdc-floating-label--float-above', putAbove);
    }

    updateButton() {
        this.buttonElement.style.display = this.hasValue ? '' : 'none';
    }

    updateCounter() {
        const {maxLength} = this;

        this.counterElement.textContent = maxLength ? `${this.value.length} / ${maxLength}` : this.value.length;
    }

    updateWrapper({focused}) {
        this.wrapperElement.classList.toggle('mdc-text-field--focused', focused);
    }

    get hasValue() {
        return Boolean(this.value);
    }

    get renderOptions() {
        return {
            eventContext: this
        };
    }
}

customElements.define('bld-abstract-input', AbstractInput);
