import BaseComponent from '../base-component';

const BASE_SIZE = 4;
const TINY = 'tiny';
const SIZES = [TINY];

class Spacer extends BaseComponent {
    render(compiler) {
        return compiler`
            <style>
                ${this.classes}
            </style>

            <div class="${this.size}"></div>
        `;
    }

    get classes() {
        return SIZES.map((size, index) => `.${size} {padding: ${this.constructor.values(index + 1).join(' ')};}`).join('');
    }

    get size() {
        const size = this.getAttribute('size');

        if (!SIZES.includes(size)) {
            return TINY;
        }

        return size;
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
