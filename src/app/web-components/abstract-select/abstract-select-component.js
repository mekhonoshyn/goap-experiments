import BaseComponent from '../base-component';

import {
    createArrayDefinition,
    createObjectDefinition,
    createNumberDefinition,
    createStringDefinition,
    createBooleanDefinition
} from 'tools/definitions';

/*
* Properties:
*   error           RO
*   disabled        RW
*   value           RW
*   listItems       WO
*   constraints     WO
*   label           WO
* */

class AbstractSelect extends BaseComponent {
    render(compiler) {
        const {disabled} = this;
        const {handleSelectChange, selectFocusHandler, selectKeydownHandler} = this;

        return compiler`
            <link rel="stylesheet" href="css/mdc.menu-surface.min.css"/>
            <link rel="stylesheet" href="css/mdc.menu.min.css"/>
            <link rel="stylesheet" href="css/mdc.select.min.css"/>
            
            ${getContainerMarkup(this)}
        `;

        function getContainerMarkup(context) {
            return disabled ? getDisabledContainerMarkup(context) : getEnabledContainerMarkup(context);
        }

        function getDisabledContainerMarkup(context) {
            const {selectedItem, value, isTouched, failedConstraint, label, required} = context.privates;
            const showInvalidity = isTouched && failedConstraint;
            const displayMessage = showInvalidity ? failedConstraint.errorMessage : '';

            return compiler`
                <div style="outline: none; display: flex; flex-direction: column;">
                    <div class="mdc-select mdc-select--disabled ${required ? 'mdc-select--required' : ''}"
                       style="width: 300px;">
                        <i class="mdc-select__dropdown-icon"></i>
                        <div class="mdc-select__selected-text">${selectedItem ? selectedItem.primaryText : ''}</div>
                        <span class="mdc-floating-label ${value ? 'mdc-floating-label--float-above' : ''}">${label}</span>
                    </div>
                    <p class="mdc-select-helper-text ${showInvalidity ? 'mdc-select-helper-text--validation-msg' : ''}"
                       title=${displayMessage}>${displayMessage}</p>
                </div>
            `;
        }

        function getEnabledContainerMarkup(context) {
            const {selectedIndex, selectedItem, value, focused, activated, isTouched, failedConstraint, label, required, listItems} = context.privates;
            const showInvalidity = isTouched && failedConstraint;
            const displayMessage = showInvalidity ? failedConstraint.errorMessage : '';

            return compiler`
                <div tabindex="0"
                   style="outline: none; display: flex; flex-direction: column;"
                   @focus=${selectFocusHandler}
                   @keydown=${selectKeydownHandler}>
                    <div class="mdc-select ${required ? 'mdc-select--required' : ''} ${showInvalidity ? 'mdc-select--invalid' : ''} ${activated ? 'mdc-select--activated' : ''} ${focused ? 'mdc-select--focused' : ''}"
                       style="width: 300px;">
                        <i class="mdc-select__dropdown-icon"></i>
                        <div class="mdc-select__selected-text">${selectedItem ? selectedItem.primaryText : ''}</div>
                        <span class="mdc-floating-label ${value || focused ? 'mdc-floating-label--float-above' : ''}">${label}</span>
                        <bld-line-ripple></bld-line-ripple>
                    </div>
                    <p class="mdc-select-helper-text ${showInvalidity ? 'mdc-select-helper-text--validation-msg' : ''}"
                       title=${displayMessage}>${displayMessage}</p>
                    <div class="mdc-select__menu mdc-menu mdc-menu-surface ${activated ? 'mdc-menu-surface--open' : ''}"
                       style="width: 300px; border-top-left-radius: 0; border-top-right-radius: 0;">
                        <bld-abstract-list selected-index=${selectedIndex} .listItems=${listItems} @select=${handleSelectChange}></bld-abstract-list>
                    </div>
                </div>
            `;
        }
    }

    onCreate() {
        // console.log('onCreate');

        this.handleDocumentClick = this.documentClickHandler.bind(this);
    }

    onConnect() {
        // console.log('onConnect');

        this.removeDocumentOnClickListener();
        this.addDocumentOnClickListener();
    }

    onDisconnect() {
        // console.log('onDisconnect');

        this.removeDocumentOnClickListener();
    }

    onRender() {
        // console.log('onRender');

        this.menuElement = this.shadowRoot.querySelector('.mdc-select__menu');
        this.listElement = this.shadowRoot.querySelector('bld-abstract-list');
        this.rippleElement = this.shadowRoot.querySelector('bld-line-ripple');
        this.wrapperElement = this.shadowRoot.querySelector('.mdc-select');
    }

    selectFocusHandler() {
        // console.log('selectFocusHandler');

        this.focus();
    }

    selectKeydownHandler(event) {
        // console.log('selectKeydownHandler');

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
        // console.log('documentClickHandler');

        if (event.composedPath().includes(this)) {
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
            }
        } else {
            this.blur();
        }
    }

    handleSelectChange(event) {
        // console.log('handleSelectChange');

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

        this.invalidate();
    }

    activate() {
        this.focus();

        if (this.privates.activated) {
            // console.log('do not activate - activated');

            return;
        }

        // console.log('activate');

        this.menuElement.style.top = `${this.wrapperElement.getBoundingClientRect().bottom}px`;

        this.privates.activated = true;

        this.invalidate();
    }

    deactivate() {
        if (!this.privates.activated) {
            // console.log('do not deactivate - not activated');

            return;
        }

        // console.log('deactivate');

        this.privates.activated = false;

        this.invalidate();
    }

    focus() {
        if (this.privates.focused) {
            // console.log('do not focus - focused');

            return;
        }

        // console.log('focus');

        this.privates.focused = true;

        this.rippleElement.activate();

        this.invalidate();
    }

    blur() {
        this.deactivate();

        if (!this.privates.focused) {
            // console.log('do not blur - not focused');

            return;
        }

        // console.log('blur');

        this.privates.focused = false;
        this.privates.isTouched = true;

        this.rippleElement.deactivate();

        this.invalidate();
    }

    addDocumentOnClickListener() {
        // console.log('addDocumentOnClickListener');

        document.addEventListener('click', this.handleDocumentClick);

        // console.log('addDocumentOnClickListener:added');
    }

    removeDocumentOnClickListener() {
        // console.log('removeDocumentOnClickListener');

        document.removeEventListener('click', this.handleDocumentClick);

        // console.log('removeDocumentOnClickListener:removed');
    }

    get error() {
        const {failedConstraint} = this.privates;

        return failedConstraint && failedConstraint.errorMessage;
    }

    get disabled() {
        return this.privates.disabled;
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
            failedConstraint: createObjectDefinition(null),
            selectedItem: createObjectDefinition(null),
            selectedIndex: createNumberDefinition(-1),
            value: createStringDefinition(null),
            label: createStringDefinition(''),
            activated: createBooleanDefinition(false),
            focused: createBooleanDefinition(false),
            isTouched: createBooleanDefinition(false),
            disabled: createBooleanDefinition(false),
            required: createBooleanDefinition(false),
            constraints: createArrayDefinition([]),
            listItems: createArrayDefinition([])
        };
    }
}

customElements.define('bld-abstract-select', AbstractSelect);
