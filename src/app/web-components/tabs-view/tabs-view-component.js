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

    class TabsView extends (await BaseComponent) {
        render() {
            if (!this.instanceId) {
                return nothing;
            }

            const {isEditable, tabsItems, selectedItem, selectedIndex} = this;
            const openCreateDialog = this.openCreateDialog.bind(this);
            const openEditDialog = this.openEditDialog.bind(this);
            const handleSelect = this.handleSelect.bind(this);

            return compile`
                <include src="tabs-view-styles.html"></include>
                
                <div class="tabs-actions-panel layout-column">
                    <awc-abstract-floating-button disabled>more_vert</awc-abstract-floating-button>
                    ${getEditActionMarkup()}
                    <awc-abstract-vertical-spacer></awc-abstract-vertical-spacer>
                    <awc-vertical-divider></awc-vertical-divider>
                    <awc-abstract-vertical-spacer></awc-abstract-vertical-spacer>
                    <awc-abstract-floating-button @click=${openCreateDialog}>add</awc-abstract-floating-button>
                </div>
                <awc-horizontal-divider></awc-horizontal-divider>
                <div class="flex layout-column"
                   style="min-width: 0;">
                    ${getAbstractTabsMarkup()}
                    ${getStructureUnitMarkup()}
                </div>
            `;

            function getEditActionMarkup() {
                return isEditable ? compile`
                    <awc-abstract-vertical-spacer></awc-abstract-vertical-spacer>
                    <awc-abstract-floating-button @click=${openEditDialog}>edit</awc-abstract-floating-button>
                ` : nothing;
            }

            function getAbstractTabsMarkup() {
                return tabsItems.length ? compile`
                    <awc-abstract-tabs selected-index=${selectedIndex} .tabsItems=${tabsItems} .trackBy=${({id}) => id} .hasIconGraphic=${false} @select=${({detail}) => handleSelect(detail)}></awc-abstract-tabs>
                    <awc-vertical-divider></awc-vertical-divider>
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

        static get deferredDependencies() {
            return [
                import('app/web-components/abstract-horizontal-divider/abstract-horizontal-divider-component'),
                import('app/web-components/abstract-vertical-divider/abstract-vertical-divider-component'),
                import('app/web-components/abstract-floating-button/abstract-floating-button-component'),
                import('app/web-components/abstract-tabs/abstract-tabs-component'),
                import('app/web-components/abstract-vertical-spacer/abstract-vertical-spacer-component')
            ];
        }
    }

    customElements.define('bld-tabs-view', TabsView);
})();
