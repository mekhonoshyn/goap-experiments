import structureUnitsService from 'app/services/structure-units-service';

(async () => {
    const [
        {html: compile, nothing},
        {default: BaseComponent}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component')
    ]);

    class StructureUnit extends (await BaseComponent) {
        render() {
            const {instance, instanceId} = this;

            if (!instanceId) {
                return nothing;
            }

            return compile`
                <include src="structure-unit-styles.html"></include>
                
                ${getCompiledComponent()}
            `;

            function getCompiledComponent() {
                switch (instance.view.type) {
                    case 'tabs-view': {
                        return compile`<bld-tabs-view instance-id="${instance.id}"></bld-tabs-view>`;
                    }
                    case 'list-view': {
                        return compile`<bld-list-view instance-id="${instance.id}"></bld-list-view>`;
                    }
                    case 'goal-view': {
                        return compile`<bld-goal-view instance-id="${instance.id}"></bld-goal-view>`;
                    }
                    case 'resource-view': {
                        return compile`<bld-resource-view instance-id="${instance.id}"></bld-resource-view>`;
                    }
                    case 'tool-view': {
                        return compile`<bld-tool-view instance-id="${instance.id}"></bld-tool-view>`;
                    }
                    // case 'process-view': {
                    //     return compile`<bld-process-view instance-id="${instance.id}"></bld-process-view>`;
                    // }
                    default: {
                        return nothing;
                    }
                }
            }
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

    customElements.define('bld-structure-unit', StructureUnit);
})();
