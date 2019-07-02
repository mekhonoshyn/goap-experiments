import BaseComponent from '../base-component';

import structureUnitsStore from '../../stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

class ResourceView extends BaseComponent {
    render(compiler) {
        return this.instance ? compiler`
            <style>
                :host {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .resource-actions-panel {
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                }

                .resource-header {
                    margin-bottom: 0;
                    padding: 8px;
                }

                .resource-sub-header {
                    padding: 8px;
                }

                .resource-container {
                    flex: 1;
                    display: flex;
                }

                .resource-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
            </style>

            <div class="resource-container">
                <div class="resource-actions-panel">
                    <bld-floating-action-button disabled>more_vert</bld-floating-action-button>
                    ${this.instance.parentId ? compiler`
                        <bld-vertical-spacer></bld-vertical-spacer>
                        <bld-floating-action-button @click=${this.openEditDialog.bind(this)}>edit</bld-floating-action-button>
                    ` : ''}
                </div>
                <bld-horizontal-divider></bld-horizontal-divider>
                <div class="resource-details">
                    <h3 class="resource-header">${this.instance.title}</h3>
                    <i class="resource-sub-header">${this.instance.description}</i>
                </div>
            </div>
        ` : '';
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

    prepareData() {
        this.instance = structureUnitsStore.findStructureUnit(this.instanceId);
    }

    static get observedAttributes() {
        return ['instance-id'];
    }

    openEditDialog() {
        structureUnitsService.openDialog(Object.assign({}, this.instance));
    }

    get instanceId() {
        return parseInt(this.getAttribute('instance-id'), 10);
    }
}

customElements.define('bld-resource-view', ResourceView);

function onSelectionPathUpdate(context) {
    context.invalidate();
}

function onStructureUnitsUpdate(context) {
    context.invalidate();
}
