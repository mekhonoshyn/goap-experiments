import BaseComponent from '../base-component';

import styles from './list-view-styles.html';

import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsActions from 'app/actions/structure-units-actions';
import structureUnitsService from 'app/services/structure-units-service';

class ListView extends BaseComponent {
    render(compiler, {unsafeHTML}, {nothing}) {
        if (!this.instanceId) {
            return nothing;
        }

        const {isEditable, listItems, selectedItem, selectedIndex} = this;
        const {handleSelect, openCreateDialog, openEditDialog} = this;

        return compiler`
            ${unsafeHTML(styles)}
            
            <div class="list-actions-panel layout-column">
                <bld-floating-action-button disabled>more_vert</bld-floating-action-button>
                ${getEditActionMarkup()}
                <bld-vertical-spacer></bld-vertical-spacer>
                <bld-vertical-divider></bld-vertical-divider>
                <bld-vertical-spacer></bld-vertical-spacer>
                <bld-floating-action-button @click=${openCreateDialog}>add</bld-floating-action-button>
            </div>
            <bld-horizontal-divider></bld-horizontal-divider>
            ${getAbstractListMarkup()}
            ${getStructureUnitMarkup()}
        `;

        function getEditActionMarkup() {
            return isEditable ? compiler`
                <bld-vertical-spacer></bld-vertical-spacer>
                <bld-floating-action-button @click=${openEditDialog}>edit</bld-floating-action-button>
            ` : nothing;
        }

        function getAbstractListMarkup() {
            return listItems.length ? compiler`
                <awc-abstract-list selected-index=${selectedIndex} .listItems=${listItems} .hasIconGraphic=${true} .hasSecondaryText=${true} @select=${handleSelect}></awc-abstract-list>
            ` : nothing;
        }

        function getStructureUnitMarkup() {
            return selectedItem ? compiler`
                <bld-structure-unit instance-id="${selectedItem.id}"></bld-structure-unit>
            ` : nothing;
        }
    }

    onCreate() {
        Object.assign(this, {
            boundOnSelectionPathUpdate: onSelectionPathUpdate.bind(null, this),
            boundOnStructureUnitsUpdate: onStructureUnitsUpdate.bind(null, this)
        });
    }

    onConnect() {
        structureUnitsStore.subscribe(this.boundOnSelectionPathUpdate);
        structureUnitsStore.subscribe(this.boundOnStructureUnitsUpdate);
    }

    onDisconnect() {
        structureUnitsStore.unSubscribe(this.boundOnSelectionPathUpdate);
        structureUnitsStore.unSubscribe(this.boundOnStructureUnitsUpdate);
    }

    static get observedAttributes() {
        return ['instance-id'];
    }

    openEditDialog() {
        structureUnitsService.openDialog(this.instance);
    }

    openCreateDialog() {
        structureUnitsService.openDialog({
            parentId: this.instance.id
        });
    }

    handleSelect({detail: selectedIndex}) {
        const selectedItem = this.listItems[selectedIndex];

        structureUnitsActions.selectStructureUnit(selectedItem.id);
    }

    get instance() {
        const {instanceId} = this;

        return structureUnitsService.findStructureUnit(instanceId);
    }

    get instanceId() {
        const instanceId = parseInt(this.getAttribute('instance-id'), 10);

        if (isNaN(instanceId)) {
            return null;
        }

        return instanceId;
    }

    get selectedItem() {
        const {instanceId} = this;

        return structureUnitsService.findStructureUnitSelectedChild(instanceId);
    }

    get listItems() {
        const {instanceId} = this;

        return structureUnitsService.findStructureUnitChildren(instanceId)
            .map(({id, title: primaryText, description: secondaryText}) => ({id, primaryText, secondaryText, iconGraphic: 'star'}));
    }

    get selectedIndex() {
        const {listItems, selectedItem} = this;

        if (!selectedItem) {
            return -1;
        }

        return listItems.findIndex(({id}) => id === selectedItem.id);
    }

    get isEditable() {
        const {instance} = this;

        if (!instance) {
            return false;
        }

        return Boolean(instance.parentId);
    }
}

customElements.define('bld-list-view', ListView);

function onSelectionPathUpdate(context) {
    context.invalidate();
}

function onStructureUnitsUpdate(context) {
    context.invalidate();
}
