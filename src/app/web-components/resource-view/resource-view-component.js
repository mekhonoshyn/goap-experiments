import structureUnitsStore from '../../stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

(async () => {
    const [
        {html: compile, nothing},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component')
    ]);

    class ResourceView extends (await BaseComponent) {
        render() {
            if (!this.instanceId) {
                return nothing;
            }

            const compiledEditAction = this.isEditable ? compile`
                <awc-abstract-vertical-spacer></awc-abstract-vertical-spacer>
                <awc-abstract-floating-button @click=${this.openEditDialog.bind(this)}>edit</awc-abstract-floating-button>
            ` : nothing;

            return compile`
                <include src="resource-view-styles.html"></include>
    
                <div class="resource-actions-panel layout-column">
                    <awc-abstract-floating-button disabled>more_vert</awc-abstract-floating-button>
                    ${compiledEditAction}
                </div>
                <awc-horizontal-divider></awc-horizontal-divider>
                <div class="layout-column flex">
                    <h3 class="resource-header">${this.instance.title}</h3>
                    <i class="resource-sub-header">${this.instance.description}</i>
                </div>
            `;
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
                import('app/web-components/abstract-floating-button/abstract-floating-button-component'),
                import('app/web-components/abstract-vertical-spacer/abstract-vertical-spacer-component')
            ];
        }
    }

    customElements.define('bld-resource-view', ResourceView);
})();
