const TINY = 'tiny';
const SIZES = [TINY];

(async () => {
    const [
        {html: compile},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component')
    ]);

    class AbstractVerticalSpacer extends (await BaseComponent) {
        render() {
            return compile`
                <include src="abstract-vertical-spacer-styles.html"></include>
    
                <div class="${this.size}"></div>
            `;
        }

        get size() {
            const size = this.getAttribute('size');

            if (!SIZES.includes(size)) {
                return TINY;
            }

            return size;
        }
    }

    customElements.define('awc-abstract-vertical-spacer', AbstractVerticalSpacer);
})();
