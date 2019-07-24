import FlattenButton from './flatten-button-component';

import styles from './floating-action-button-styles.html';

export default class extends FlattenButton {
    render(compiler, {unsafeHTML}, {nothing}) {
        return compiler`
            ${super.render(compiler, {unsafeHTML}, {nothing})}
            
            ${unsafeHTML(styles)}
        `;
    }

    getIconMarkup(compiler) {
        return compiler`
            <span class="material-icons mdc-button__icon">
                <slot></slot>
            </span>
        `;
    }

    get hasIconGraphic() {
        return true;
    }

    get hasLabelText() {
        return false;
    }

    get rounding() {
        return '50%';
    }

    get raised() {
        return true;
    }

    get noPadding() {
        return true;
    }
}
