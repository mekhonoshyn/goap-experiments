(async () => {
    const [
        {html: compile, nothing},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component')
    ]);

    class AbstractFlattenButton extends (await BaseComponent) {
        render() {
            const iconStylesheetMarkup = this.isIconic ? compile`
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
            ` : nothing;

            return compile`
                ${iconStylesheetMarkup}
    
                <include src="abstract-flatten-button-styles.html"></include>
                
                <style>
                    .mdc-button {
                        ${this.noRounding ? 'border-radius: 0;' : 'border-radius: 4x;'}
                        ${this.noPadding ? 'padding: 0;' : ''}
                    }
                </style>
    
                <button class="mdc-button ${this.isIconic ? 'mdc-button--no-label' : ''}"
                   ?disabled=${this.disabled}>
                    <span class="${this.isIconic ? 'material-icons mdc-button__icon' : 'mdc-button__label'}">
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

        set disabled(disabled) {
            if (disabled) {
                this.setAttribute('disabled', '');
            } else {
                this.removeAttribute('disabled');
            }
        }

        get noRounding() {
            return this.hasAttribute('no-rounding');
        }

        get noPadding() {
            return this.hasAttribute('no-padding');
        }

        get isIconic() {
            return this.hasAttribute('iconic');
        }
    }

    customElements.define('awc-abstract-flatten-button', AbstractFlattenButton);

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
})();
