import BaseComponent from '../base-component';

class AbstractDialog extends BaseComponent {
    render(compiler, {repeat}, {nothing}) {
        const {footerSlots = [], hasTitle} = this;

        return compiler`
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
            return compiler`
                <div class="mdc-dialog__title">
                    <slot name="dialog-title"></slot>
                </div>
            `;
        }

        function getFooterMarkup() {
            return compiler`
                <footer class="mdc-dialog__actions">
                    ${repeat(footerSlots, getFooterSlotMarkup)}
                </footer>
            `;
        }

        function getFooterSlotMarkup(slotName) {
            return compiler`
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

        (await import('tools/sleep')).default(300);

        this.dialogElement.classList.remove('mdc-dialog--opening');
    }

    async close() {
        this.dialogElement.classList.add('mdc-dialog--closing');
        this.dialogElement.classList.remove('mdc-dialog--open');

        (await import('tools/sleep')).default(300);

        this.dialogElement.classList.remove('mdc-dialog--closing');
    }
}

customElements.define('awc-abstract-dialog', AbstractDialog);
