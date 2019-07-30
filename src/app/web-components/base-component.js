import {html, render, nothing} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';
import sleep from 'tools/sleep';

const privatesMap = new WeakMap();

export default class extends HTMLElement {
    constructor() {
        super();

        createPrivates(this);

        this.setPrivate('awaitingForRender', false);

        if (this.constructor.hasShadowDOM) {
            this.attachShadow({mode: 'open'});
        }

        this.onCreate();
    }

    async connectedCallback() {
        await this.invalidate();

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

        await sleep();

        if (!hasPrivates(this)) {
            return;
        }

        this.setPrivate('awaitingForRender', false);

        if (this.constructor.hasShadowDOM) {
            render(this.render(html, {repeat, unsafeHTML}, {nothing, nothingFn}), this.shadowRoot, this.renderOptions);
        }

        this.onRender();
    }

    render(compiler, directives, parts) {
        return nothing;
    }

    onRender() {}

    getPrivate(key) {
        return readPrivates(this)[key];
    }

    setPrivate(key, value) {
        readPrivates(this)[key] = value;
    }

    static get observedAttributes() {
        return [];
    }

    static get hasShadowDOM() {
        return true;
    }

    get renderOptions() {
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
