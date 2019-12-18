import BaseComponent from '../../base-component';

const DEFAULT_ROUNDING = '4px';

export default class FlattenButton extends BaseComponent {
    render(compiler, unused, {nothing}) {
        const iconStylesheetMarkup = this.hasIconGraphic ? compiler`
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
        ` : nothing;

        return compiler`
            ${iconStylesheetMarkup}

            <include src="flatten-button-styles.html"></include>
            
            <style>
                .mdc-button {
                    border-radius: ${this.rounding};
                    ${this.noPadding ? 'padding: 0;' : ''}
                }
            </style>

            <button class="mdc-button ${this.raised ? 'mdc-button--raised' : ''} ${this.hasLabelText ? '' : 'mdc-button--no-label'}"
               ?disabled=${this.disabled}>
                ${this.hasIconGraphic ? this.getIconMarkup(compiler) : nothing}
                ${this.hasLabelText ? this.getLabelMarkup(compiler) : nothing}
            </button>
        `;
    }

    getIconMarkup(compiler) {
        return compiler`
            <span class="material-icons mdc-button__icon">${this.icon}</span>
        `;
    }

    getLabelMarkup(compiler) {
        return compiler`
            <span class="mdc-button__label">
                <slot></slot>
            </span>
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

    set disabled(disabled) {
        if (disabled) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    get icon() {
        return this.getAttribute('icon');
    }

    get rounding() {
        return this.getAttribute('rounding') || DEFAULT_ROUNDING;
    }

    get noPadding() {
        return this.hasAttribute('no-padding');
    }

    get hasIconGraphic() {
        return Boolean(this.icon);
    }

    get hasLabelText() {
        return Boolean(this.innerHTML);
    }

    get raised() {
        return false;
    }
}

function clickEventHandler(element, event) {
    preventActionIfDisabled(element, event);
}

function keyDownEventHandler(element, event) {
    if (['Enter'].includes(event.key) || ['Space'].includes(event.code)) {
        preventActionIfDisabled(element, event);
    }
}

function preventActionIfDisabled(element, event) {
    if (element.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
}
