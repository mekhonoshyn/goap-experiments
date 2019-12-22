import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsActions from 'app/actions/structure-units-actions';
import structureUnitsService from 'app/services/structure-units-service';

(async () => {
    const [
        {html: compile, nothing},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component')
    ]);

    class ListView extends (await BaseComponent) {
        render() {
            if (!this.instanceId) {
                return nothing;
            }

            const {isEditable, listItems, selectedItem, selectedIndex} = this;
            const {handleSelect, openCreateDialog, openEditDialog} = this;

            return compile`
                <include src="list-view-styles.html"></include>
                
                <div class="list-actions-panel layout-column">
                    <awc-abstract-floating-button disabled>more_vert</awc-abstract-floating-button>
                    ${getEditActionMarkup()}
                    <awc-abstract-vertical-spacer></awc-abstract-vertical-spacer>
                    <awc-vertical-divider></awc-vertical-divider>
                    <awc-abstract-vertical-spacer></awc-abstract-vertical-spacer>
                    <awc-abstract-floating-button @click=${openCreateDialog}>add</awc-abstract-floating-button>
                </div>
                <awc-horizontal-divider></awc-horizontal-divider>
                ${getAbstractListMarkup()}
                ${getStructureUnitMarkup()}
            `;

            function getEditActionMarkup() {
                return isEditable ? compile`
                    <awc-abstract-vertical-spacer></awc-abstract-vertical-spacer>
                    <awc-abstract-floating-button @click=${openEditDialog}>edit</awc-abstract-floating-button>
                ` : nothing;
            }

            function getAbstractListMarkup() {
                return listItems.length ? compile`
                    <awc-abstract-list selected-index=${selectedIndex} .listItems=${listItems} .hasIconGraphic=${true} .hasSecondaryText=${true} @select=${handleSelect}></awc-abstract-list>
                ` : nothing;
            }

            function getStructureUnitMarkup() {
                return selectedItem ? compile`
                    <bld-structure-unit instance-id="${selectedItem.id}"></bld-structure-unit>
                ` : nothing;
            }
        }

        onCreate() {
            Object.assign(this, {
                boundOnSelectionPathUpdate: this.onSelectionPathUpdate.bind(this),
                boundOnStructureUnitsUpdate: this.onStructureUnitsUpdate.bind(this)
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

        onSelectionPathUpdate() {
            this.invalidate();
        }

        onStructureUnitsUpdate() {
            this.invalidate();
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

        static get deferredDependencies() {
            return [
                import('app/web-components/abstract-horizontal-divider/abstract-horizontal-divider-component'),
                import('app/web-components/abstract-vertical-divider/abstract-vertical-divider-component'),
                import('app/web-components/abstract-floating-button/abstract-floating-button-component'),
                import('app/web-components/abstract-list/abstract-list-component'),
                import('app/web-components/abstract-vertical-spacer/abstract-vertical-spacer-component')
            ];
        }
    }

    customElements.define('bld-list-view', ListView);
})();
