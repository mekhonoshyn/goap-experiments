(async () => {
    const [
        {html: compile},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component')
    ]);

    class AbstractHorizontalDivider extends (await BaseComponent) {
        render() {
            return compile`
                <include src="abstract-horizontal-divider-styles.html"></include>
            `;
        }
    }

    customElements.define('awc-horizontal-divider', AbstractHorizontalDivider);
})();
