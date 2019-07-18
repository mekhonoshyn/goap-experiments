import BaseComponent from '../base-component';

const ACTION_TRIGGERING_CODES = ['Space', 'Enter', 'NumpadEnter'];

class Button extends BaseComponent {
    render(compiler) {
        return compiler`
            <link rel="stylesheet" href="css/mdc.button.min.css"/>

            <style>
                :host {
                    outline: none;
                }
            </style>

            <button class="mdc-button mdc-button--dense" ?disabled=${this.disabled}>
                <span class="mdc-button__label">
                    <slot></slot>
                </span>
            </button>
        `;
    }

    onCreate() {
        this.clickEventHandler = clickEventHandler.bind(null, this);
        this.keyDownEventHandler = keyDownEventHandler.bind(null, this);

        this.addEventListener('click', this.clickEventHandler);
        this.addEventListener('keydown', this.keyDownEventHandler);
    }

    onDisconnect() {
        this.removeEventListener('click', this.clickEventHandler);
        this.removeEventListener('keydown', this.keyDownEventHandler);
    }

    static get observedAttributes() {
        return ['disabled'];
    }

    get disabled() {
        return this.hasAttribute('disabled');
    }
}

class ActionButton extends Button {
    render(compiler) {
        return compiler`
            <link rel="stylesheet" href="css/mdc.button.min.css"/>

            <style>
                :host {
                    outline: none;
                }
            </style>

            <button class="mdc-button mdc-button--raised mdc-button--dense" ?disabled=${this.disabled}>
                <span class="mdc-button__label">
                    <slot></slot>
                </span>
            </button>
        `;
    }
}

class FloatingActionButton extends Button {
    render(compiler) {
        return compiler`
            <link rel="stylesheet" href="css/mdc.button.min.css"/>
            
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>

            <style>
                :host {
                    outline: none;
                }
                
                .mdc-button.mdc-button--dense {
                    border-radius: 50%;
                    width: 32px;
                    min-width: 32px;
                }
    
                .mdc-button .mdc-button__icon {
                    margin: 0;
                    width: 24px;
                    height: 24px;
                    font-size: 24px;
                }
            </style>

            <button class="mdc-button mdc-button--raised mdc-button--dense" ?disabled=${this.disabled}>
                <span class="material-icons mdc-button__icon"
                   aria-hidden="true">
                    <slot></slot>
                </span>
            </button>
        `;
    }
}

customElements.define('bld-button', Button);
customElements.define('bld-action-button', ActionButton);
customElements.define('bld-floating-action-button', FloatingActionButton);

function clickEventHandler(element, event) {
    preventActionIfDisabled(element, event);
}

function keyDownEventHandler(element, event) {
    if (ACTION_TRIGGERING_CODES.includes(event.code)) {
        preventActionIfDisabled(element, event);
    }
}

function preventActionIfDisabled(element, event) {
    if (element.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
}
