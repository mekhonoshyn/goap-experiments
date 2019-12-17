import BaseComponent from '../base-component';

import {
    createObjectDefinition
} from 'tools/definitions';

import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

class StructureUnit extends BaseComponent {
    render(compiler, unused, {nothing}) {
        const {rootInstance} = this.privates;

        if (!rootInstance) {
            return nothing;
        }

        return compiler`
            <include src="structure-root-styles.html"></include>
            
            <bld-structure-unit instance-id=${rootInstance.id}></bld-structure-unit>
        `;
    }

    onCreate() {
        this.boundOnStructureUnitsUpdate = this.onStructureUnitsUpdate.bind(this);
    }

    onConnect() {
        structureUnitsStore.subscribe(this.boundOnStructureUnitsUpdate);
    }

    onDisconnect() {
        structureUnitsStore.unSubscribe(this.boundOnStructureUnitsUpdate);
    }

    onStructureUnitsUpdate() {
        this.privates.rootInstance = structureUnitsService.findStructureUnit(1);

        this.invalidate();
    }

    static get privatesDefinition() {
        return {
            rootInstance: createObjectDefinition(null)
        };
    }
}

customElements.define('bld-structure-root', StructureUnit);
