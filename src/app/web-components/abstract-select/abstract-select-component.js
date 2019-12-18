import BaseComponent from '../base-component';

import plainDefinition from 'tools/definitions/plain-definition';

/**
 * Properties:
 *   error           RO
 *   disabled        WO
 *   value           RW
 *   listItems       WO
 *   constraints     WO
 *   label           WO
 */

class AbstractSelect extends BaseComponent {
    render(compiler) {
        const {disabled, selectedIndex, selectedItem, focused, activated, value, isTouched, failedConstraint, label, required, listItems} = this.privates;
        const {handleSelectChange, selectFocusHandler, selectKeydownHandler} = this;
        const showInvalidity = isTouched && failedConstraint;
        const displayMessage = showInvalidity ? failedConstraint.errorMessage : '';

        return compiler`
            <include src="abstract-select-styles.html"></include>

            ${disabled ? getDisabledContainerMarkup() : getEnabledContainerMarkup()}
        `;

        function getDisabledContainerMarkup() {
            return compiler`
                <div class="mdc-select__container layout-column">
                    <div class="mdc-select mdc-select--disabled ${required ? 'mdc-select--required' : ''}">
                        <i class="mdc-select__dropdown-icon"></i>
                        <div class="mdc-select__selected-text">${selectedItem ? selectedItem.primaryText : ''}</div>
                        <span class="mdc-floating-label ${value ? 'mdc-floating-label--float-above' : ''}">${label}</span>
                    </div>
                    <p class="mdc-select-helper-text ${showInvalidity ? 'mdc-select-helper-text--validation-msg' : ''}"
                       title=${displayMessage}>${displayMessage}</p>
                </div>
            `;
        }

        function getEnabledContainerMarkup() {
            return compiler`
                <div tabindex="0"
                   class="mdc-select__container layout-column"
                   @focus=${selectFocusHandler}
                   @keydown=${selectKeydownHandler}>
                    <div class="mdc-select ${required ? 'mdc-select--required' : ''} ${showInvalidity ? 'mdc-select--invalid' : ''} ${activated ? 'mdc-select--activated' : ''} ${focused ? 'mdc-select--focused' : ''}">
                        <i class="mdc-select__dropdown-icon"></i>
                        <div class="mdc-select__selected-text">${selectedItem ? selectedItem.primaryText : ''}</div>
                        <span class="mdc-floating-label ${value || focused ? 'mdc-floating-label--float-above' : ''}">${label}</span>
                        <awc-line-ripple></awc-line-ripple>
                    </div>
                    <p class="mdc-select-helper-text ${showInvalidity ? 'mdc-select-helper-text--validation-msg' : ''}"
                       title=${displayMessage}>${displayMessage}</p>
                    <div class="mdc-select__menu mdc-menu mdc-menu-surface ${activated ? 'mdc-menu-surface--open' : ''}">
                        <awc-abstract-list selected-index=${selectedIndex} .listItems=${listItems} @select=${handleSelectChange}></awc-abstract-list>
                    </div>
                </div>
            `;
        }
    }

    onCreate() {
        this.handleDocumentClick = this.documentClickHandler.bind(this);
    }

    onConnect() {
        this.removeDocumentOnClickListener();
        this.addDocumentOnClickListener();
    }

    onDisconnect() {
        this.removeDocumentOnClickListener();
    }

    onRender() {
        this.menuElement = this.shadowRoot.querySelector('.mdc-select__menu');
        this.listElement = this.shadowRoot.querySelector('awc-abstract-list');
        this.rippleElement = this.shadowRoot.querySelector('awc-line-ripple');
        this.wrapperElement = this.shadowRoot.querySelector('.mdc-select');
    }

    selectFocusHandler() {
        this.focus();
    }

    selectKeydownHandler(event) {
        if (['Tab'].includes(event.key)) {
            this.blur();

            return;
        }

        if (this.privates.activated) {
            if (['Escape'].includes(event.key)) {
                this.deactivate();

                return;
            }

            if (['ArrowUp'].includes(event.key)) {
                this.privates.selectedIndex = (Math.max(0, this.privates.selectedIndex) - 1 + this.privates.listItems.length) % this.privates.listItems.length;

                this.invalidate();

                return;
            }

            if (['ArrowDown'].includes(event.key)) {
                this.privates.selectedIndex = (this.privates.selectedIndex + 1) % this.privates.listItems.length;

                this.invalidate();

                return;
            }

            if (['Enter'].includes(event.key)) {
                if (this.privates.selectedIndex !== -1) {
                    this.listElement.dispatchEvent(new CustomEvent('select', {detail: this.privates.selectedIndex}));
                }
            }
        } else {
            if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key) || ['Space'].includes(event.code)) {
                this.activate();
            }
        }
    }

    documentClickHandler(event) {
        if (event.composedPath().includes(this.listElement)) {
            return;
        }

        if (event.composedPath().includes(this.wrapperElement)) {
            if (this.privates.focused) {
                if (this.privates.activated) {
                    this.deactivate();
                } else {
                    this.activate();
                }
            } else {
                this.activate();
            }
        } else {
            this.blur();
        }
    }

    handleSelectChange(event) {
        const selectedIndex = event.detail;
        const selectedItem = this.privates.listItems[selectedIndex];

        this.privates.selectedItem = selectedItem;
        this.privates.selectedIndex = selectedIndex;
        this.privates.value = selectedItem && selectedItem.id;
        this.privates.isTouched = true;

        this.validate();
        this.deactivate();
        this.invalidate();

        this.dispatchEvent(new Event('change'));
    }

    validate() {
        const {value, constraints} = this.privates;

        this.privates.failedConstraint = constraints.find(({test}) => !test(value)) || null;
    }

    activate() {
        this.focus();

        if (this.privates.activated) {
            return;
        }

        this.menuElement.style.top = `${this.wrapperElement.getBoundingClientRect().bottom}px`;

        this.privates.activated = true;

        this.invalidate();
    }

    deactivate() {
        if (!this.privates.activated) {
            return;
        }

        this.privates.activated = false;

        this.invalidate();
    }

    focus() {
        if (this.privates.focused) {
            return;
        }

        this.privates.focused = true;

        this.rippleElement.activate();

        this.invalidate();
    }

    blur() {
        this.deactivate();

        if (!this.privates.focused) {
            return;
        }

        this.privates.focused = false;
        this.privates.isTouched = true;

        this.rippleElement.deactivate();

        this.invalidate();
    }

    addDocumentOnClickListener() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    removeDocumentOnClickListener() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    get error() {
        const {failedConstraint} = this.privates;

        return failedConstraint && failedConstraint.errorMessage;
    }

    set disabled(disabled) {
        this.privates.disabled = disabled;

        this.removeDocumentOnClickListener();

        if (disabled) {
            this.blur();
        } else {
            this.addDocumentOnClickListener();
        }

        this.invalidate();
    }

    get value() {
        return this.privates.value;
    }

    set value(value) {
        this.privates.value = value;

        (async () => {
            await this.privates.propertiesBound;

            const {listItems} = this.privates;

            const selectedItem = listItems.find(({id}) => id === value) || null;
            const selectedIndex = listItems.indexOf(selectedItem);

            this.privates.selectedItem = selectedItem;
            this.privates.selectedIndex = selectedIndex;
            this.privates.value = selectedItem && selectedItem.id;

            this.validate();
            this.invalidate();
        })();
    }

    set listItems(listItems) {
        this.privates.listItems = listItems;

        (async () => {
            await this.privates.propertiesBound;

            const {value} = this.privates;

            const selectedItem = listItems.find(({id}) => id === value) || null;
            const selectedIndex = listItems.indexOf(selectedItem);

            this.privates.selectedItem = selectedItem;
            this.privates.selectedIndex = selectedIndex;
            this.privates.value = selectedItem && selectedItem.id;

            this.validate();
            this.invalidate();
        })();
    }

    set constraints(constraints) {
        this.privates.constraints = constraints;

        this.privates.required = Boolean(constraints.find(({name}) => name === 'required'));

        this.validate();
        this.invalidate();
    }

    set label(label) {
        this.privates.label = label;

        this.invalidate();
    }

    static get privatesDefinition() {
        return {
            failedConstraint: plainDefinition(null),
            selectedItem: plainDefinition(null),
            selectedIndex: plainDefinition(-1),
            value: plainDefinition(null),
            label: plainDefinition(''),
            activated: plainDefinition(false),
            focused: plainDefinition(false),
            isTouched: plainDefinition(false),
            disabled: plainDefinition(false),
            required: plainDefinition(false),
            constraints: plainDefinition([]),
            listItems: plainDefinition([])
        };
    }
}

customElements.define('awc-abstract-select', AbstractSelect);
