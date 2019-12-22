const DEFAULT_HAS_ICON_GRAPHIC = false;
const DEFAULT_HAS_SECONDARY_TEXT = false;
const DEFAULT_TRACK_BY = ({id}) => id;

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

    class AbstractList extends (await BaseComponent) {
        render() {
            const {hasIconGraphic = DEFAULT_HAS_ICON_GRAPHIC, hasSecondaryText = DEFAULT_HAS_SECONDARY_TEXT, selectedIndex, listItems, trackBy = DEFAULT_TRACK_BY} = this;
            const handleListItemSelect = this.handleListItemSelect.bind(this);

            const iconStylesheetMarkup = hasIconGraphic ? compile`
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
            ` : nothing;

            return compile`
                ${iconStylesheetMarkup}
    
                <include src="abstract-list-styles.html"></include>
    
                <ul class="mdc-list ${hasSecondaryText ? 'mdc-list--two-line' : ''} flex"
                   @click=${handleListItemSelect}>
                    ${repeat(listItems, trackBy, getItemTemplateMarkup)}
                </ul>
            `;

            function getIconGraphicMarkup(itemInstance) {
                return compile`
                    <span class="material-icons mdc-list-item__graphic">${itemInstance.iconGraphic}</span>
                `;
            }

            function getItemTemplateMarkup(itemInstance, index) {
                return compile`
                    <li class="mdc-list-item ${index === selectedIndex ? 'mdc-list-item--selected' : ''}"
                       data-index=${index}>
                        ${hasIconGraphic ? getIconGraphicMarkup(itemInstance) : nothing}
                        ${hasSecondaryText ? getTwoLinesTextMarkup(itemInstance) : getOneLineTextMarkup(itemInstance)}
                    </li>
                `;
            }

            function getTwoLinesTextMarkup(itemInstance) {
                if (itemInstance.secondaryText) {
                    return compile`
                        <span class="mdc-list-item__text">
                            ${getPrimaryTextMarkup(itemInstance)}
                            ${getSecondaryTextMarkup(itemInstance)}
                        </span>
                    `;
                }

                return itemInstance.primaryText;
            }

            function getOneLineTextMarkup(itemInstance) {
                return compile`
                    <span class="mdc-list-item__text">${itemInstance.primaryText}</span>
                `;
            }

            function getPrimaryTextMarkup(itemInstance) {
                return compile`
                    <span class="mdc-list-item__primary-text">${itemInstance.primaryText}</span>
                `;
            }

            function getSecondaryTextMarkup(itemInstance) {
                return compile`
                    <span class="mdc-list-item__secondary-text">${itemInstance.secondaryText}</span>
                `;
            }
        }

        static get observedAttributes() {
            return ['selected-index'];
        }

        handleListItemSelect(event) {
            const listItemElement = event.composedPath().find(({classList}) => classList && classList.contains('mdc-list-item'));

            if (!listItemElement) {
                return;
            }

            const selectedIndex = parseInt(listItemElement.getAttribute('data-index'), 10);

            if (this.selectedIndex === selectedIndex) {
                return;
            }

            const selectionEvent = new CustomEvent('select', {detail: selectedIndex});

            this.dispatchEvent(selectionEvent);
        }

        get listItems() {
            return this.privates.listItems;
        }

        set listItems(listItems) {
            this.privates.listItems = listItems;

            this.invalidate();
        }

        get selectedIndex() {
            const selectedIndex = parseInt(this.getAttribute('selected-index'), 10);

            if (isNaN(selectedIndex)) {
                return -1;
            }

            return selectedIndex;
        }

        static get privatesDefinition() {
            return {
                listItems: plainDefinition([])
            };
        }
    }

    customElements.define('awc-abstract-list', AbstractList);
})();
