import structureUnitsStore from '../../stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

(async () => {
    const [
        {html: compile, nothing},
        {repeat},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('lit-html/directives/repeat'),
        import('app/web-components/base-component')
    ]);

    class GoalView extends (await BaseComponent) {
        render() {
            if (!this.instanceId) {
                return nothing;
            }

            const compiledEditAction = this.isEditable ? compile`
                <awc-abstract-vertical-spacer></awc-abstract-vertical-spacer>
                <awc-abstract-floating-button @click=${this.openEditDialog.bind(this)}>edit</awc-abstract-floating-button>
            ` : nothing;

            return compile`
                <include src="goal-view-styles.html"></include>
                
                <div class="goal-actions-panel layout-column">
                    <awc-abstract-floating-button disabled>more_vert</awc-abstract-floating-button>
                    ${compiledEditAction}
                </div>
                <awc-horizontal-divider></awc-horizontal-divider>
                <div class="layout-column flex">
                    <h3 class="goal-header">${this.instance.title}</h3>
                    <i class="goal-sub-header">${this.instance.description}</i>
                    
                    <div class="layout-column">
                        <div class="layout-row"
                           style="padding: 8px;">
                            <h3 class="flex"
                               style="margin: auto;">Tools</h3>
            
                            <awc-abstract-floating-button @click=${this.addTool.bind(this)}>add</awc-abstract-floating-button>
                        </div>
            
                        ${repeat(this.goalTools, ({id}) => id, () => nothing)}
            
                        <awc-vertical-divider></awc-vertical-divider>
                    </div>
                    
                    <div class="layout-column">
                        <div class="layout-row"
                           style="padding: 8px;">
                            <h3 class="flex"
                               style="margin: auto;">Resources</h3>
            
                            <awc-abstract-floating-button @click=${this.addResource.bind(this)}>add</awc-abstract-floating-button>
                        </div>
            
                        ${repeat(this.goalResources, ({id}) => id, () => nothing)}
            
                        <awc-vertical-divider></awc-vertical-divider>
                    </div>
                    
                    <div class="layout-column">
                        <div class="layout-row"
                           style="padding: 8px;">
                            <h3 class="flex"
                               style="margin: auto;">Result</h3>
                        </div>
            
                        <awc-vertical-divider></awc-vertical-divider>
                    </div>
            
                    <div class="layout-column">
                        <div class="layout-row"
                           style="padding: 8px;">
                            <h3 class="flex"
                               style="margin: auto;">Timeline</h3>
                        </div>
                    </div>
                </div>
            `;
        }

        onCreate() {
            Object.assign(this, {
                goalTools: [],
                goalResources: [],

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

        addTool() {}

        addResource() {}

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
                import('app/web-components/abstract-vertical-divider/abstract-vertical-divider-component'),
                import('app/web-components/abstract-floating-button/abstract-floating-button-component'),
                import('app/web-components/abstract-vertical-spacer/abstract-vertical-spacer-component')
            ];
        }
    }

    customElements.define('bld-goal-view', GoalView);
})();
