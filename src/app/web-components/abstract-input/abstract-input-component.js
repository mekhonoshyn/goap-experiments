import BaseComponent from '../base-component';

import plainDefinition from 'tools/definitions/plain-definition';

/**
 * Properties:
 *   error           RO
 *   disabled        WO
 *   value           RW
 *   constraints     WO
 *   label           WO
 */

class AbstractInput extends BaseComponent {
    render(compiler, unused, {nothing}) {
        const {value} = this;
        const {disabled, label, inputFocused, buttonFocused, isTouched, failedConstraint, required, maxLength} = this.privates;
        const {handleInputBlur, handleInputFocus, handleInputInput, handleButtonClick, handleButtonKeydown, handleButtonBlur, handleButtonFocus} = this;
        const showInvalidity = isTouched && failedConstraint;
        const displayMessage = showInvalidity ? failedConstraint.errorMessage : '';

        return compiler`
            <include src="abstract-input-styles.html"></include>

            <div class="mdc-text-field__container layout-column">
                <div class="mdc-text-field mdc-text-field--with-trailing-icon ${disabled ? 'mdc-text-field--disabled' : ''} ${inputFocused ? 'mdc-text-field--focused' : ''} ${showInvalidity ? 'mdc-text-field--invalid' : ''}">
                    <input class="mdc-text-field__input"
                       ?disabled=${disabled}
                       ?required=${required}
                       @blur=${handleInputBlur}
                       @focus=${handleInputFocus}
                       @input=${handleInputInput}/>
                    <label class="mdc-floating-label ${value || inputFocused ? 'mdc-floating-label--float-above' : ''}">${label}</label>
                    ${disabled || !value ? nothing : getButtonMarkup()}
                    <awc-line-ripple></awc-line-ripple>
                </div>
                <div class="mdc-text-field-helper-line">
                    <div class="mdc-text-field-helper-text ${showInvalidity ? 'mdc-text-field-helper-text--validation-msg' : ''}"
                       title=${displayMessage}>${displayMessage}</div>
                    <div class="mdc-text-field-character-counter">${maxLength ? `${value.length} / ${maxLength}` : value.length}</div>
                </div>
            </div>
        `;

        function getButtonMarkup() {
            return compiler`
                <i class="material-icons mdc-text-field__icon ${buttonFocused ? 'mdc-text-field__icon--focused' : ''}"
                   @click=${handleButtonClick}
                   @keydown=${handleButtonKeydown}
                   @blur=${handleButtonBlur}
                   @focus=${handleButtonFocus}
                   tabindex="0">cancel</i>
            `;
        }
    }

    onRender() {
        this.inputElement = this.shadowRoot.querySelector('.mdc-text-field__input');
        this.rippleElement = this.shadowRoot.querySelector('awc-line-ripple');
    }

    handleInputBlur() {
        this.blur();
    }

    handleInputFocus() {
        this.focus();
    }

    focus() {
        if (this.privates.inputFocused) {
            return;
        }

        this.privates.inputFocused = true;

        this.rippleElement.activate();

        this.invalidate();
    }

    blur() {
        if (!this.privates.inputFocused) {
            return;
        }

        this.privates.inputFocused = false;
        this.privates.isTouched = true;

        this.rippleElement.deactivate();

        this.invalidate();
    }

    handleInputInput() {
        this.privates.isTouched = true;

        this.validate();
        this.invalidate();
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
        this.privates.buttonFocused = false;

        this.invalidate();
    }

    handleButtonFocus() {
        this.privates.buttonFocused = true;

        this.invalidate();
    }

    validate() {
        const {value} = this;
        const {constraints} = this.privates;

        this.privates.failedConstraint = constraints.find(({test}) => !test(value)) || null;
    }

    get value() {
        return this.inputElement ? this.inputElement.value : '';
    }

    set value(value) {
        (async () => {
            await this.privates.rendered;

            this.inputElement.value = value;

            this.validate();
            this.invalidate();

            this.dispatchEvent(new Event('input'));
        })();
    }

    set constraints(constraints) {
        this.privates.constraints = constraints;

        const requiredConstraint = constraints.find(({name}) => name === 'required');
        const maxLengthConstraint = constraints.find(({name}) => name === 'maxlength');

        this.privates.required = Boolean(requiredConstraint);
        this.privates.maxLength = maxLengthConstraint && maxLengthConstraint.params[0] || 0;

        this.validate();
        this.invalidate();
    }

    set disabled(disabled) {
        this.privates.disabled = disabled;

        if (disabled) {
            this.blur();
        }

        this.invalidate();
    }

    set label(label) {
        this.privates.label = label;

        this.invalidate();
    }

    get error() {
        const {failedConstraint} = this.privates;

        return failedConstraint && failedConstraint.errorMessage;
    }

    static get privatesDefinition() {
        return {
            isTouched: plainDefinition(false),
            failedConstraint: plainDefinition(null),
            inputFocused: plainDefinition(false),
            buttonFocused: plainDefinition(false),
            required: plainDefinition(false),
            maxLength: plainDefinition(0),
            constraints: plainDefinition([]),
            disabled: plainDefinition(false),
            label: plainDefinition('')
        };
    }
}

customElements.define('awc-abstract-input', AbstractInput);
