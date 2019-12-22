(async () => {
    const [
        {html: compile},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component')
    ]);

    class AbstractVerticalDivider extends (await BaseComponent) {
        render() {
            return compile`
                <include src="abstract-vertical-divider-styles.html"></include>
            `;
        }
    }

    customElements.define('awc-vertical-divider', AbstractVerticalDivider);
})();
