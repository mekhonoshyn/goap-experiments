import BaseComponent from '../base-component';

import styles from './tabs-view-styles.html';

import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsActions from 'app/actions/structure-units-actions';
import structureUnitsService from 'app/services/structure-units-service';

class TabsView extends BaseComponent {
    render(compiler, {unsafeHTML}, {nothing}) {
        if (!this.instanceId) {
            return nothing;
        }

        const {isEditable, tabsItems, selectedItem, selectedIndex} = this;
        const openCreateDialog = this.openCreateDialog.bind(this);
        const openEditDialog = this.openEditDialog.bind(this);
        const handleSelect = this.handleSelect.bind(this);

        return compiler`
            ${unsafeHTML(styles)}
            
            <div class="tabs-actions-panel layout-column">
                <bld-floating-action-button disabled>more_vert</bld-floating-action-button>
                ${getEditActionMarkup()}
                <bld-vertical-spacer></bld-vertical-spacer>
                <bld-vertical-divider></bld-vertical-divider>
                <bld-vertical-spacer></bld-vertical-spacer>
                <bld-floating-action-button @click=${openCreateDialog}>add</bld-floating-action-button>
            </div>
            <bld-horizontal-divider></bld-horizontal-divider>
            <div style="min-width: 0; flex: 1; display: flex; flex-direction: column;">
                ${getAbstractTabsMarkup()}
                ${getStructureUnitMarkup()}
            </div>
        `;

        function getEditActionMarkup() {
            return isEditable ? compiler`
                <bld-vertical-spacer></bld-vertical-spacer>
                <bld-floating-action-button @click=${openEditDialog}>edit</bld-floating-action-button>
            ` : nothing;
        }

        function getAbstractTabsMarkup() {
            return tabsItems.length ? compiler`
                <bld-abstract-tabs selected-index=${selectedIndex} .tabsItems=${tabsItems} .trackBy=${({id}) => id} .hasIconGraphic=${false} @select=${({detail}) => handleSelect(detail)}></bld-abstract-tabs>
                <bld-vertical-divider></bld-vertical-divider>
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
        structureUnitsService.openDialog(Object.assign({}, this.instance));
    }

    openCreateDialog() {
        structureUnitsService.openDialog({
            parentId: this.instance.id
        });
    }

    handleSelect(selectedIndex) {
        const selectedItem = this.tabsItems[selectedIndex];

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

    get tabsItems() {
        const {instanceId} = this;

        return structureUnitsService.findStructureUnitChildren(instanceId)
            .map(({id, title}) => ({id, title, iconGraphic: 'star'}));
    }

    get selectedIndex() {
        const {tabsItems, selectedItem} = this;

        if (!selectedItem) {
            return -1;
        }

        return tabsItems.findIndex(({id}) => id === selectedItem.id);
    }

    get isEditable() {
        const {instance} = this;

        if (!instance) {
            return false;
        }

        return Boolean(instance.parentId);
    }
}

customElements.define('bld-tabs-view', TabsView);

function onSelectionPathUpdate(context) {
    context.invalidate();
}

function onStructureUnitsUpdate(context) {
    context.invalidate();
}
