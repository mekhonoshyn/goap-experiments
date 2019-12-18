import BaseComponent from '../base-component';

import plainDefinition from 'tools/definitions/plain-definition';

const PAGINATION_FACTOR = 0.8;

class AbstractTabs extends BaseComponent {
    render(compiler, {repeat}, {nothing, nothingFn}) {
        const {hasIconGraphic, selectedIndex, tabsItems, trackBy, showNavigationButtons} = this;
        const handleTabsItemSelect = this.handleTabsItemSelect.bind(this);
        const handleTabsNavigation = this.handleTabsNavigation.bind(this);

        const iconStylesheetMarkup = hasIconGraphic ? compiler`
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
        ` : nothing;
        const iconMarkup = hasIconGraphic ? getIconGraphicMarkup : nothingFn;

        return compiler`
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
            return compiler`
                <bld-flatten-button icon="navigate_before"
                   @click=${handleTabsNavigation.bind(null, -1)}
                   no-padding
                   rounding="0"
                   disabled></bld-flatten-button>
            `;
        }

        function getNavigateRightButtonMarkup() {
            return compiler`
                <bld-flatten-button icon="navigate_next"
                   @click=${handleTabsNavigation.bind(null, 1)}
                   no-padding
                   rounding="0"
                   disabled></bld-flatten-button>
            `;
        }

        function getIconGraphicMarkup(itemInstance) {
            return compiler`
                <span class="mdc-tab__icon material-icons">${itemInstance.iconGraphic}</span>
            `;
        }

        function getItemTemplateMarkup(itemInstance, index) {
            return compiler`
                <button class="mdc-tab ${index === selectedIndex ? 'mdc-tab--active' : ''}"
                   data-index=${index}
                   type="button">
                    <span class="mdc-tab__content">
                        ${iconMarkup(itemInstance)}
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
            return compiler`
                <span class="mdc-tab__text-label">${itemInstance.title}</span>
            `;
        }
    }

    onRender() {
        this.staticWrapper = this.shadowRoot.querySelector('.mdc-tab-scroller__scroll-area');
        this.movableContent = this.shadowRoot.querySelector('.mdc-tab-scroller__scroll-content');
        this.navigateLeftButton = this.shadowRoot.querySelector('[icon=navigate_before]');
        this.navigateRightButton = this.shadowRoot.querySelector('[icon=navigate_next]');

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

        await this.staticWrapper.scrollBy(staticWrapperBoundingClientRect.width * direction * PAGINATION_FACTOR, 0);

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
}

customElements.define('awc-abstract-tabs', AbstractTabs);
