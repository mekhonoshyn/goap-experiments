import BaseComponent from '../base-component';

import styles from './goal-view-styles.html';

import structureUnitsStore from '../../stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

class GoalView extends BaseComponent {
    render(compiler, {repeat, unsafeHTML}, {nothing}) {
        if (!this.instance) {
            return nothing;
        }

        const compiledEditAction = this.instance.parentId ? compiler`
            <bld-vertical-spacer></bld-vertical-spacer>
            <bld-floating-action-button @click=${this.openEditDialog.bind(this)}>edit</bld-floating-action-button>
        ` : nothing;

        return compiler`
            ${unsafeHTML(styles)}
            
            <div class="layout-row flex">
                <div class="goal-actions-panel layout-column">
                    <bld-floating-action-button disabled>more_vert</bld-floating-action-button>
                    ${compiledEditAction}
                </div>
                <bld-horizontal-divider></bld-horizontal-divider>
                <div class="layout-column flex">
                    <h3 class="goal-header">${this.instance.title}</h3>
                    <i class="goal-sub-header">${this.instance.description}</i>
                    
                    <div class="layout-column">
                        <div class="layout-row layout-align-space-around-center"
                           style="padding: 8px;">
                            <h3 class="flex"
                               style="margin: auto;">Tools</h3>
            
                            <bld-floating-action-button @click=${this.addTool.bind(this)}>add</bld-floating-action-button>
                        </div>
            
                        ${repeat(this.goalTools, ({id}) => id, () => nothing)}
            
                        <bld-vertical-divider></bld-vertical-divider>
                    </div>
                    
                    <div class="layout-column">
                        <div class="layout-row"
                           style="padding: 8px;">
                            <h3 class="flex"
                               style="margin: auto;">Resources</h3>
            
                            <bld-floating-action-button @click=${this.addResource.bind(this)}>add</bld-floating-action-button>
                        </div>
            
                        ${repeat(this.goalResources, ({id}) => id, () => nothing)}
            
                        <bld-vertical-divider></bld-vertical-divider>
                    </div>
                    
                    <div class="layout-column">
                        <div class="layout-row layout-align-space-around-center"
                           style="padding: 8px;">
                            <h3 class="flex"
                               style="margin: auto;">Result</h3>
                        </div>
            
                        <bld-vertical-divider></bld-vertical-divider>
                    </div>
            
                    <div class="layout-column">
                        <div class="layout-row layout-align-space-around-center"
                           style="padding: 8px;">
                            <h3 class="flex"
                               style="margin: auto;">Timeline</h3>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    onCreate() {
        Object.assign(this, {
            goalTools: [],
            goalResources: [],

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

    prepareData() {
        this.instance = structureUnitsStore.findStructureUnit(this.instanceId);
    }

    static get observedAttributes() {
        return ['instance-id'];
    }

    get instanceId() {
        return parseInt(this.getAttribute('instance-id'), 10);
    }

    openEditDialog() {
        structureUnitsService.openDialog(Object.assign({}, this.instance));
    }

    addTool() {}

    addResource() {}
}

customElements.define('bld-goal-view', GoalView);

function onSelectionPathUpdate(context) {
    context.invalidate();
}

function onStructureUnitsUpdate(context) {
    context.invalidate();
}
