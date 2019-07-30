import BaseComponent from '../base-component';
import sleep from 'tools/sleep';

import styles from './abstract-dialog-styles.html';

class AbstractDialog extends BaseComponent {
    render(compiler, {unsafeHTML, repeat}, {nothing}) {
        const {footerSlots = [], hasTitle} = this;

        return compiler`
            <link rel="stylesheet" href="css/mdc.dialog.min.css"/>
            
            ${unsafeHTML(styles)}

            <div class="mdc-dialog">
                <div class="mdc-dialog__container">
                    <div class="mdc-dialog__surface">
                        ${hasTitle ? getHeaderMarkup() : nothing}

                        <slot class="mdc-dialog__content"
                           name="dialog-content"></slot>

                        ${footerSlots.length ? getFooterMarkup() : nothing}
                    </div>
                </div>
                <div class="mdc-dialog__scrim"></div>
            </div>
        `;

        function getHeaderMarkup() {
            return compiler`
                <slot class="mdc-dialog__title"
                   name="dialog-title"></slot>
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
                <slot class="mdc-dialog__button"
                   name="${slotName}"></slot>
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

customElements.define('bld-abstract-dialog', AbstractDialog);
