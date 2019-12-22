(async () => {
    const [
        {html: compile},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component')
    ]);

    class AbstractFloatingButton extends (await BaseComponent) {
        render() {
            return compile`
                <include src="abstract-floating-button-styles.html"></include>
                
                <style>
                    .mdc-button {
                        ${this.noPadding ? 'padding: 0;' : ''}
                    }
                </style>
    
                <button class="mdc-button mdc-button--raised mdc-button--no-label"
                   ?disabled=${this.disabled}>
                    <span class="material-icons mdc-button__icon">
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

        get noPadding() {
            return this.hasAttribute('no-padding');
        }
    }

    customElements.define('awc-abstract-floating-button', AbstractFloatingButton);

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
