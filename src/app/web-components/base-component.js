import {html, render, nothing} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';

const privates = new WeakMap();

export default class extends HTMLElement {
    constructor() {
        super();

        privates.set(this, {
            awaitingForRender: false
        });

        this.attachShadow({mode: 'open'});

        this.onCreate();
    }

    connectedCallback() {
        this.invalidate();

        this.onConnect();
    }

    attributeChangedCallback() {
        this.invalidate();

        this.onUpdate();
    }

    disconnectedCallback() {
        this.onDisconnect();
    }

    onCreate() {}

    onConnect() {}

    onUpdate() {}

    onDisconnect() {}

    async invalidate() {
        if (privates.get(this).awaitingForRender) {
            return;
        }

        await this.prepareData();

        privates.get(this).awaitingForRender = true;

        await Promise.resolve();

        render(this.render(html, {repeat, unsafeHTML}, {nothing}), this.shadowRoot, this.constructor.renderOptions);

        privates.get(this).awaitingForRender = false;
    }

    prepareData() {}

    /**
     * @abstract
     * @param {Function} compiler - template compiler
     * @param {Object} directives - rendering helpers
     * @param {Object} parts - rendering helpers
     * @return {*} compiled template
     */
    render(compiler, directives, parts) {
        throw Error('method "render" is abstract and should be instantiated');
    }

    static get observedAttributes() {
        return [];
    }

    static get renderOptions() {
        return {};
    }
}
