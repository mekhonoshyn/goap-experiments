import BaseComponent from '../base-component';

import styles from './abstract-input-styles.html';

import {
    createObjectDefinition,
    createBooleanDefinition
} from 'tools/definitions';

class AbstractInput extends BaseComponent {
    render(compiler, {unsafeHTML}) {
        const {label, disabled, required} = this;
        const {handleInputBlur, handleInputFocus, handleInputInput, handleButtonClick, handleButtonKeydown, handleButtonBlur, handleButtonFocus} = this;

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
                   @click=${handleButtonClick}
                   @keydown=${handleButtonKeydown}
                   @blur=${handleButtonBlur}
                   @focus=${handleButtonFocus}
                   tabindex="0">cancel</i>
                <bld-line-ripple></bld-line-ripple>
            </div>
            <div class="mdc-text-field-helper-line">
                <div class="mdc-text-field-helper-text"></div>
                <div class="mdc-text-field-character-counter"></div>
            </div>
        `;
    }

    onRender() {
        this.inputElement = this.shadowRoot.querySelector('.mdc-text-field__input');
        this.labelElement = this.shadowRoot.querySelector('.mdc-floating-label');
        this.helperElement = this.shadowRoot.querySelector('.mdc-text-field-helper-text');
        this.buttonElement = this.shadowRoot.querySelector('.mdc-text-field__icon');
        this.rippleElement = this.shadowRoot.querySelector('bld-line-ripple');
        this.counterElement = this.shadowRoot.querySelector('.mdc-text-field-character-counter');
        this.wrapperElement = this.shadowRoot.querySelector('.mdc-text-field');

        if (!this.privates.hasInitialValue) {
            this.value = '';
        }
    }

    onUpdate() {
        this.value = this.getAttribute('value') || '';
    }

    static get observedAttributes() {
        return ['disabled', 'value'];
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
        this.privates.isTouched = true;

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
        this.privates.isTouched = true;
    }

    handleButtonKeydown(event) {
        if (event.key === 'Enter') {
            this.value = '';
            this.privates.isTouched = true;
        }
    }

    handleButtonBlur() {
        this.buttonElement.classList.remove('mdc-text-field__icon--focused');
    }

    handleButtonFocus() {
        this.buttonElement.classList.add('mdc-text-field__icon--focused');
    }

    get value() {
        return this.inputElement.value;
    }

    set value(value) {
        this.privates.hasInitialValue = true;

        (async () => {
            await this.privates.firstRenderHappen;

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

        this.privates.failedConstraint = this.constraints.find(({test}) => !test(value)) || null;

        this.reportValidity();
    }

    reportValidity() {
        const {isTouched, failedConstraint} = this.privates;
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

    static get privatesDefinition() {
        return {
            isTouched: createBooleanDefinition(false),
            failedConstraint: createObjectDefinition(null),
            hasInitialValue: createBooleanDefinition(false)
        };
    }
}

customElements.define('bld-abstract-input', AbstractInput);
