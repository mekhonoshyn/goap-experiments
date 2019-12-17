import BaseComponent from '../base-component';

import {
    createArrayDefinition
} from 'tools/definitions';

const DEFAULT_HAS_ICON_GRAPHIC = false;
const DEFAULT_HAS_SECONDARY_TEXT = false;
const DEFAULT_TRACK_BY = ({id}) => id;

class AbstractList extends BaseComponent {
    render(compiler, {repeat}, {nothing, nothingFn}) {
        const {hasIconGraphic = DEFAULT_HAS_ICON_GRAPHIC, hasSecondaryText = DEFAULT_HAS_SECONDARY_TEXT, selectedIndex, listItems, trackBy = DEFAULT_TRACK_BY} = this;
        const handleListItemSelect = this.handleListItemSelect.bind(this);

        const iconStylesheetMarkup = hasIconGraphic ? compiler`
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
        ` : nothing;
        const iconMarkup = hasIconGraphic ? getIconGraphicMarkup : nothingFn;
        const textMarkup = hasSecondaryText ? getTwoLinesTextMarkup : getOneLineTextMarkup;

        return compiler`
            ${iconStylesheetMarkup}

            <include src="abstract-list-styles.html"></include>

            <ul class="mdc-list ${hasSecondaryText ? 'mdc-list--two-line' : ''} flex"
               @click=${handleListItemSelect}>
                ${repeat(listItems, trackBy, getItemTemplateMarkup)}
            </ul>
        `;

        function getIconGraphicMarkup(itemInstance) {
            return compiler`
                <span class="material-icons mdc-list-item__graphic">${itemInstance.iconGraphic}</span>
            `;
        }

        function getItemTemplateMarkup(itemInstance, index) {
            return compiler`
                <li class="mdc-list-item ${index === selectedIndex ? 'mdc-list-item--selected' : ''}"
                   data-index=${index}>
                    ${iconMarkup(itemInstance)}
                    ${textMarkup(itemInstance)}
                </li>
            `;
        }

        function getTwoLinesTextMarkup(itemInstance) {
            if (itemInstance.secondaryText) {
                return compiler`
                    <span class="mdc-list-item__text">
                        ${getPrimaryTextMarkup(itemInstance)}
                        ${getSecondaryTextMarkup(itemInstance)}
                    </span>
                `;
            }

            return itemInstance.primaryText;
        }

        function getOneLineTextMarkup(itemInstance) {
            return compiler`
                <span class="mdc-list-item__text">${itemInstance.primaryText}</span>
            `;
        }

        function getPrimaryTextMarkup(itemInstance) {
            return compiler`
                <span class="mdc-list-item__primary-text">${itemInstance.primaryText}</span>
            `;
        }

        function getSecondaryTextMarkup(itemInstance) {
            return compiler`
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
            listItems: createArrayDefinition([])
        };
    }
}

customElements.define('awc-abstract-list', AbstractList);
