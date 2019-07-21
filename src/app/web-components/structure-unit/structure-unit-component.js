import BaseComponent from '../base-component';

import styles from './structure-unit-styles.html';

import structureUnitsService from 'app/services/structure-units-service';

class StructureUnitView extends BaseComponent {
    render(compiler, {unsafeHTML}, {nothing}) {
        if (!this.instanceId) {
            return nothing;
        }

        return compiler`
            ${unsafeHTML(styles)}
            
            ${getCompiledComponent(this.instance, {compiler, nothing})}
        `;
    }

    static get observedAttributes() {
        return ['instance-id'];
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
}

customElements.define('bld-structure-unit-new', StructureUnitView);

function getCompiledComponent(instance, {compiler, nothing}) {
    switch (instance.view.type) {
        case 'tabs-view': {
            return compiler`<bld-tabs-view instance-id="${instance.id}"></bld-tabs-view>`;
        }
        case 'list-view': {
            return compiler`<bld-list-view instance-id="${instance.id}"></bld-list-view>`;
        }
        case 'goal-view': {
            return compiler`<bld-goal-view instance-id="${instance.id}"></bld-goal-view>`;
        }
        case 'resource-view': {
            return compiler`<bld-resource-view instance-id="${instance.id}"></bld-resource-view>`;
        }
        case 'tool-view': {
            return compiler`<bld-tool-view instance-id="${instance.id}"></bld-tool-view>`;
        }
        case 'process-view': {
            return compiler`<bld-process-view instance-id="${instance.id}"></bld-process-view>`;
        }
        default: {
            return nothing;
        }
    }
}
