import BaseComponent from '../base-component';

class Divider extends BaseComponent {
    render(compiler) {
        return compiler`
            <style>
                :host {
                    ${this.constructor.property}: 1px solid rgba(0, 0, 0, 0.12);
                }
            </style>
        `;
    }

    static get property() {
        throw Error('static getter "property" should be overridden');
    }
}

class HorizontalDivider extends Divider {
    static get property() {
        return 'border-right';
    }
}

class VerticalDivider extends Divider {
    static get property() {
        return 'border-top';
    }
}

customElements.define('bld-horizontal-divider', HorizontalDivider);
customElements.define('bld-vertical-divider', VerticalDivider);
