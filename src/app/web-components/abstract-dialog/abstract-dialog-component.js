(async () => {
    const [
        {html: compile, nothing},
        {repeat},
        {default: sleep},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('lit-html/directives/repeat'),
        import('tools/sleep'),
        import('app/web-components/base-component')
    ]);

    class AbstractDialog extends (await BaseComponent) {
        render() {
            const {footerSlots = [], hasTitle} = this;

            return compile`
                <include src="abstract-dialog-styles.html"></include>
    
                <div class="mdc-dialog">
                    <div class="mdc-dialog__container">
                        <div class="mdc-dialog__surface">
                            ${hasTitle ? getHeaderMarkup() : nothing}
    
                            <div class="mdc-dialog__content">
                                <slot name="dialog-content"></slot>
                            </div>
    
                            ${footerSlots.length ? getFooterMarkup() : nothing}
                        </div>
                    </div>
                    <div class="mdc-dialog__scrim"></div>
                </div>
            `;

            function getHeaderMarkup() {
                return compile`
                    <div class="mdc-dialog__title">
                        <slot name="dialog-title"></slot>
                    </div>
                `;
            }

            function getFooterMarkup() {
                return compile`
                    <footer class="mdc-dialog__actions">
                        ${repeat(footerSlots, getFooterSlotMarkup)}
                    </footer>
                `;
            }

            function getFooterSlotMarkup(slotName) {
                return compile`
                    <div class="mdc-dialog__button">
                        <slot name="${slotName}"></slot>
                    </div>
                `;
            }
        }

        onRender() {
            this.dialogElement = this.shadowRoot.querySelector('.mdc-dialog');
        }

        get hasTitle() {
            return Boolean(this.querySelector('[slot=dialog-title]'));
        }

        async open() {
            await this.privates.rendered;

            this.dialogElement.classList.add('mdc-dialog--opening');
            this.dialogElement.classList.add('mdc-dialog--open');

            await sleep(300);

            this.dialogElement.classList.remove('mdc-dialog--opening');
        }

        async close() {
            this.dialogElement.classList.add('mdc-dialog--closing');
            this.dialogElement.classList.remove('mdc-dialog--open');

            await sleep(300);

            this.dialogElement.classList.remove('mdc-dialog--closing');
        }
    }

    customElements.define('awc-abstract-dialog', AbstractDialog);
})();
