import plainDefinition from 'tools/definitions/plain-definition';
import deferredDefinition from 'tools/definitions/deferred-definition';

export default class BaseComponent extends HTMLElement {
    constructor() {
        super();

        const extendedPrivatesDefinition = Object.assign(this.constructor.privatesDefinition, {
            rendering: plainDefinition(false),
            rendered: deferredDefinition(),
            attributesBound: deferredDefinition(),
            propertiesBound: deferredDefinition()
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
        if (this.privates.rendering) {
            return;
        }

        this.privates.rendering = true;

        if (this.constructor.hasShadowDOM) {
            const {
                repeat,
                render,
                compile,
                nothing,
                nothingFn
            } = await import('tools/directives');

            render(this.render(compile, {repeat}, {nothing, nothingFn}), this.shadowRoot, this.renderOptions);
        } else {
            (await import('tools/sleep')).default();
        }

        this.privates.rendering = false;

        this.privates.rendered = true;

        this.onRender();
    }

    render(compile, directives, {nothing}) {
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

    get renderOptions() {
        return {
            eventContext: this
        };
    }
}
