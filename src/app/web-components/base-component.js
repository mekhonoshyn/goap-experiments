import {html, render, nothing} from 'lit-html';
import {repeat} from 'lit-html/directives/repeat';
import {unsafeHTML} from 'lit-html/directives/unsafe-html';
import sleep from 'tools/sleep';
import {
    createBooleanDefinition,
    createDeferredDefinition
} from 'tools/definitions';

export default class extends HTMLElement {
    constructor() {
        super();

        const extendedPrivatesDefinition = Object.assign({}, this.constructor.privatesDefinition, {
            awaitingForRender: createBooleanDefinition(false),
            firstRenderHappen: createDeferredDefinition(),
            attributesBound: createDeferredDefinition(),
            propertiesBound: createDeferredDefinition()
        });

        Object.defineProperty(this, 'privates', {
            value: Object.defineProperties({}, extendedPrivatesDefinition)
        });

        if (this.constructor.hasShadowDOM) {
            this.attachShadow({mode: 'open'});
        }

        this.onCreate();
    }

    async connectedCallback() {
        this.privates.propertiesBound = true;

        await this.invalidate();

        this.onConnect();
    }

    async attributeChangedCallback() {
        this.privates.attributesBound = true;

        await this.onUpdate();

        await this.invalidate();
    }

    disconnectedCallback() {
        this.onDisconnect();
    }

    onCreate() {}

    onConnect() {}

    async onUpdate() {}

    onDisconnect() {}

    async invalidate() {
        if (this.privates.awaitingForRender) {
            return;
        }

        this.privates.awaitingForRender = true;

        await sleep();

        this.privates.awaitingForRender = false;

        if (this.constructor.hasShadowDOM) {
            render(this.render(html, {repeat, unsafeHTML}, {nothing, nothingFn}), this.shadowRoot, this.constructor.renderOptions);
        }

        this.privates.firstRenderHappen = true;

        this.onRender();
    }

    render(compiler, directives, parts) {
        return nothing;
    }

    onRender() {}

    static get observedAttributes() {
        return [];
    }

    static get hasShadowDOM() {
        return true;
    }

    static get privatesDefinition() {
        return {};
    }

    static get renderOptions() {
        return {
            eventContext: this
        };
    }
}

function nothingFn() {
    return nothing;
}
