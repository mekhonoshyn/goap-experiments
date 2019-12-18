import FlattenButton from './flatten-button-component';

export default class FloatingActionButton extends FlattenButton {
    render(compiler, unused, {nothing}) {
        return compiler`
            ${super.render(compiler, unused, {nothing})}
            
            <include src="floating-action-button-styles.html"></include>
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
