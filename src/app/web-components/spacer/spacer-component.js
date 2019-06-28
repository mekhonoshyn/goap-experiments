import BaseComponent from '../base-component';

const BASE_SIZE = 4;
const TINY = 'tiny';
const SIZES = [TINY];

class Spacer extends BaseComponent {
    onCreate() {
        this.compiledClasses = SIZES.map((size, index) => `.${size} {padding: ${this.constructor.values(index + 1).join(' ')};}`).join('');
    }

    render(compiler) {
        return compiler`
            <style>
                ${this.compiledClasses}
            </style>

            <div class="${this.size}"></div>
        `;
    }

    get size() {
        const size = this.getAttribute('size');

        return SIZES.includes(size) ? size : TINY;
    }

    static values() {
        throw Error('static method "property" should be overridden');
    }
}

class HorizontalSpacer extends Spacer {
    static values(modifier) {
        return [0, `${BASE_SIZE * modifier}px`];
    }
}

class VerticalSpacer extends Spacer {
    static values(modifier) {
        return [`${BASE_SIZE * modifier}px`, 0];
    }
}

customElements.define('bld-horizontal-spacer', HorizontalSpacer);
customElements.define('bld-vertical-spacer', VerticalSpacer);
