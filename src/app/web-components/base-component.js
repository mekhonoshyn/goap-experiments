import {html, render, nothing} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';

const privatesMap = new WeakMap();

export default class extends HTMLElement {
    constructor() {
        super();

        createPrivates(this);

        this.setPrivate('awaitingForRender', false);

        this.attachShadow({mode: 'open'});

        this.onCreate();
    }

    connectedCallback() {
        this.invalidate();

        this.onConnect();
    }

    attributeChangedCallback() {
        this.onUpdate();

        this.invalidate();
    }

    disconnectedCallback() {
        this.onDisconnect();

        deletePrivates(this);
    }

    onCreate() {}

    onConnect() {}

    onUpdate() {}

    onDisconnect() {}

    async invalidate() {
        if (this.getPrivate('awaitingForRender')) {
            return;
        }

        this.setPrivate('awaitingForRender', true);

        await this.prepareData();

        if (!hasPrivates(this)) {
            return;
        }

        this.setPrivate('awaitingForRender', false);

        render(this.render(html, {repeat, unsafeHTML}, {nothing, nothingFn}), this.shadowRoot, this.constructor.renderOptions);
    }

    prepareData() {}

    /**
     * @abstract
     * @param {Function} compiler - template compiler
     * @param {Object} [directives] - rendering helpers
     * @param {Object} [parts] - rendering helpers
     * @return {*} compiled template
     */
    render(compiler, directives, parts) {
        throw Error('method "render" is abstract and should be instantiated');
    }

    getPrivate(key) {
        return readPrivates(this)[key];
    }

    setPrivate(key, value) {
        readPrivates(this)[key] = value;
    }

    static get observedAttributes() {
        return [];
    }

    static get renderOptions() {
        return {};
    }
}

function readPrivates(context) {
    return privatesMap.get(context);
}

function createPrivates(context) {
    privatesMap.set(context, {});
}

function deletePrivates(context) {
    privatesMap.delete(context);
}

function hasPrivates(context) {
    return privatesMap.has(context);
}

function nothingFn() {
    return nothing;
}
