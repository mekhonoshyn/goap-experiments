const PAGINATION_FACTOR = 0.8;

(async () => {
    const [
        {html: compile, nothing},
        {repeat},
        {default: BaseComponent},
        {default: plainDefinition}
    ] = await Promise.all([
        import('lit-html'),
        import('lit-html/directives/repeat'),
        import('app/web-components/base-component'),
        import('tools/definitions/plain-definition')
    ]);

    class AbstractTabs extends (await BaseComponent) {
        render() {
            const {hasIconGraphic, selectedIndex, tabsItems, trackBy, showNavigationButtons} = this;
            const handleTabsItemSelect = this.handleTabsItemSelect.bind(this);
            const handleTabsNavigation = this.handleTabsNavigation.bind(this);

            const iconStylesheetMarkup = hasIconGraphic ? compile`
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
            ` : nothing;

            return compile`
                ${iconStylesheetMarkup}
    
                <include src="abstract-tabs-styles.html"></include>
                
                <div class="mdc-tab-bar">
                    ${showNavigationButtons ? getNavigateLeftButtonMarkup() : nothing}
                    <div class="mdc-tab-scroller"
                       @click=${handleTabsItemSelect}>
                        <div class="mdc-tab-scroller__scroll-area">
                            <div class="mdc-tab-scroller__scroll-content">
                                ${repeat(tabsItems, trackBy, getItemTemplateMarkup)}
                            </div>
                        </div>
                    </div>
                    ${showNavigationButtons ? getNavigateRightButtonMarkup() : nothing}
                </div>
            `;

            function getNavigateLeftButtonMarkup() {
                return compile`
                    <awc-abstract-flatten-button id="navigate-left-button"
                       @click=${handleTabsNavigation.bind(null, -1)}
                       no-padding
                       no-rounding
                       disabled
                       iconic>navigate_before</awc-abstract-flatten-button>
                `;
            }

            function getNavigateRightButtonMarkup() {
                return compile`
                    <awc-abstract-flatten-button id="navigate-right-button"
                       @click=${handleTabsNavigation.bind(null, 1)}
                       no-padding
                       no-rounding
                       disabled
                       iconic>navigate_next</awc-abstract-flatten-button>
                `;
            }

            function getIconGraphicMarkup(itemInstance) {
                return compile`
                    <span class="mdc-tab__icon material-icons">${itemInstance.iconGraphic}</span>
                `;
            }

            function getItemTemplateMarkup(itemInstance, index) {
                return compile`
                    <button class="mdc-tab ${index === selectedIndex ? 'mdc-tab--active' : ''}"
                       data-index=${index}
                       type="button">
                        <span class="mdc-tab__content">
                            ${hasIconGraphic ? getIconGraphicMarkup(itemInstance) : nothing}
                            ${getTextMarkup(itemInstance)}
                        </span>
                        <span class="mdc-tab-indicator ${index === selectedIndex ? 'mdc-tab-indicator--active' : ''}">
                            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                        </span>
                        <span class="mdc-tab__ripple"></span>
                    </button>
                `;
            }

            function getTextMarkup(itemInstance) {
                return compile`
                    <span class="mdc-tab__text-label">${itemInstance.title}</span>
                `;
            }
        }

        onRender() {
            this.staticWrapper = this.shadowRoot.querySelector('.mdc-tab-scroller__scroll-area');
            this.movableContent = this.shadowRoot.querySelector('.mdc-tab-scroller__scroll-content');
            this.navigateLeftButton = this.shadowRoot.querySelector('#navigate-left-button');
            this.navigateRightButton = this.shadowRoot.querySelector('#navigate-right-button');

            if (this.showNavigationButtons) {
                this.recomputeNavigationState();
            }
        }

        static get observedAttributes() {
            return ['selected-index'];
        }

        handleTabsItemSelect(event) {
            const tabsItemElement = event.composedPath().find(({classList}) => classList && classList.contains('mdc-tab'));

            if (!tabsItemElement) {
                return;
            }

            const selectedIndex = parseInt(tabsItemElement.getAttribute('data-index'), 10);

            if (this.selectedIndex === selectedIndex) {
                return;
            }

            const selectionEvent = new CustomEvent('select', {detail: selectedIndex});

            this.dispatchEvent(selectionEvent);
        }

        async handleTabsNavigation(direction) {
            const staticWrapperBoundingClientRect = this.staticWrapper.getBoundingClientRect();
            const scrollByAmount = staticWrapperBoundingClientRect.width * direction * PAGINATION_FACTOR;

            if (this.staticWrapper.scrollBy) {
                await this.staticWrapper.scrollBy(scrollByAmount, 0);
            } else {
                this.staticWrapper.scrollLeft += scrollByAmount;
            }

            this.recomputeNavigationState();
        }

        recomputeNavigationState() {
            const staticWrapperBoundingClientRect = this.staticWrapper.getBoundingClientRect();
            const movableContentBoundingClientRect = this.movableContent.getBoundingClientRect();

            this.navigateLeftButton.disabled = staticWrapperBoundingClientRect.left - movableContentBoundingClientRect.left < 1;
            this.navigateRightButton.disabled = movableContentBoundingClientRect.right - staticWrapperBoundingClientRect.right < 1;
        }

        get tabsItems() {
            return this.privates.tabsItems;
        }

        set tabsItems(tabsItems) {
            this.privates.tabsItems = tabsItems;

            this.invalidate();
        }

        get selectedIndex() {
            const selectedIndex = parseInt(this.getAttribute('selected-index'), 10);

            if (isNaN(selectedIndex)) {
                return -1;
            }

            return selectedIndex;
        }

        get showNavigationButtons() {
            return Boolean(this.tabsItems.length);
        }

        static get privatesDefinition() {
            return {
                tabsItems: plainDefinition([])
            };
        }

        static get deferredDependencies() {
            return [
                import('app/web-components/abstract-flatten-button/abstract-flatten-button-component')
            ];
        }
    }

    customElements.define('awc-abstract-tabs', AbstractTabs);
})();
