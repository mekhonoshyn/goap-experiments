import BaseComponent from '../base-component';

import structureUnitsStore from '../../stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

class ResourceView extends BaseComponent {
    render(compiler, unused, {nothing}) {
        if (!this.instanceId) {
            return nothing;
        }

        const compiledEditAction = this.isEditable ? compiler`
            <bld-vertical-spacer></bld-vertical-spacer>
            <bld-floating-action-button @click=${this.openEditDialog.bind(this)}>edit</bld-floating-action-button>
        ` : nothing;

        return compiler`
            <include src="resource-view-styles.html"></include>

            <div class="resource-actions-panel layout-column">
                <bld-floating-action-button disabled>more_vert</bld-floating-action-button>
                ${compiledEditAction}
            </div>
            <bld-horizontal-divider></bld-horizontal-divider>
            <div class="layout-column flex">
                <h3 class="resource-header">${this.instance.title}</h3>
                <i class="resource-sub-header">${this.instance.description}</i>
            </div>
        `;
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
}

customElements.define('bld-resource-view', ResourceView);

function onSelectionPathUpdate(context) {
    context.invalidate();
}

function onStructureUnitsUpdate(context) {
    context.invalidate();
}
