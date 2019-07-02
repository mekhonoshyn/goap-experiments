import BaseComponent from '../base-component';

import structureUnitsStore from '../../stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

class ToolView extends BaseComponent {
    render(compiler) {
        return this.instance ? compiler`
            <style>
                :host {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .tool-actions-panel {
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                }

                .tool-header {
                    margin-bottom: 0;
                    padding: 8px;
                }

                .tool-sub-header {
                    padding: 8px;
                }

                .tool-container {
                    flex: 1;
                    display: flex;
                }

                .tool-details {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
            </style>

            <div class="tool-container">
                <div class="tool-actions-panel">
                    <bld-floating-action-button disabled>more_vert</bld-floating-action-button>
                    ${this.instance.parentId ? compiler`
                        <bld-vertical-spacer></bld-vertical-spacer>
                        <bld-floating-action-button @click=${this.openEditDialog.bind(this)}>edit</bld-floating-action-button>
                    ` : ''}
                </div>
                <bld-horizontal-divider></bld-horizontal-divider>
                <div class="tool-details">
                    <h3 class="tool-header">${this.instance.title}</h3>
                    <i class="tool-sub-header">${this.instance.description}</i>
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

customElements.define('bld-tool-view', ToolView);

function onSelectionPathUpdate(context) {
    context.invalidate();
}

function onStructureUnitsUpdate(context) {
    context.invalidate();
}
