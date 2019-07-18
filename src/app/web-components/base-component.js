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

        await this.prepareData();

        this.setPrivate('awaitingForRender', true);

        await Promise.resolve();

        render(this.render(html, {repeat, unsafeHTML}, {nothing, nothingFn}), this.shadowRoot, this.constructor.renderOptions);

        this.setPrivate('awaitingForRender', false);
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
        const privates = readPrivates(this);

        if (privates) {
            return privates[key];
        }

        return undefined;
    }

    setPrivate(key, value) {
        const privates = readPrivates(this);

        if (privates) {
            privates[key] = value;
        }
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

function nothingFn() {
    return nothing;
}
