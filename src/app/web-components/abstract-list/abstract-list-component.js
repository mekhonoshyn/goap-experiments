import BaseComponent from '../base-component';

import styles from './abstract-list-styles.html';

class AbstractList extends BaseComponent {
    render(compiler, {unsafeHTML, repeat}, {nothing, nothingFn}) {
        const {hasIconGraphic, hasSecondaryText, selectedIndex, listItems, trackBy} = this;
        const handleListItemSelect = this.handleListItemSelect.bind(this);

        const iconStylesheetMarkup = hasIconGraphic ? compiler`
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
        ` : nothing;
        const iconMarkup = hasIconGraphic ? getIconGraphicMarkup : nothingFn;
        const textMarkup = hasSecondaryText ? getTwoLinesTextMarkup : getOneLineTextMarkup;

        return compiler`
            <link rel="stylesheet" href="css/mdc.list.min.css"/>

            ${iconStylesheetMarkup}

            ${unsafeHTML(styles)}

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

    onCreate() {
        this.setPrivate('listItems', []);
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
        return this.getPrivate('listItems');
    }

    set listItems(listItems) {
        this.setPrivate('listItems', listItems);

        this.invalidate();
    }

    get selectedIndex() {
        const selectedIndex = parseInt(this.getAttribute('selected-index'), 10);

        if (isNaN(selectedIndex)) {
            return -1;
        }

        return selectedIndex;
    }
}

customElements.define('bld-abstract-list', AbstractList);
