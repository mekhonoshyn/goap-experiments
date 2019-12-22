export default new Promise(async (resolve) => {
    const [
        {render, nothing},
        {default: sleep},
        {default: plainDefinition},
        {default: deferredDefinition}
    ] = await Promise.all([
        import('lit-html'),
        import('tools/sleep'),
        import('tools/definitions/plain-definition'),
        import('tools/definitions/deferred-definition')
    ]);

    class BaseComponent extends HTMLElement {
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
            await Promise.all(this.constructor.deferredDependencies);

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

            await sleep();

            if (this.constructor.hasShadowDOM) {
                render(this.render(), this.shadowRoot, this.renderOptions);
            }

            this.privates.rendering = false;

            this.privates.rendered = true;

            this.onRender();
        }

        render() {
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

        static get deferredDependencies() {
            return [];
        }

        get renderOptions() {
            return {
                eventContext: this
            };
        }
    }

    resolve(BaseComponent);
});
