import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

(async () => {
    const [
        {html: compile, nothing},
        {default: BaseComponent},
        {default: plainDefinition}
    ] = await Promise.all([
        import('lit-html'),
        import('app/web-components/base-component'),
        import('tools/definitions/plain-definition')
    ]);

    class StructureRoot extends (await BaseComponent) {
        render() {
            const {rootInstance} = this.privates;

            if (!rootInstance) {
                return nothing;
            }

            return compile`
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
                rootInstance: plainDefinition(null)
            };
        }
    }

    customElements.define('bld-structure-root', StructureRoot);
})();
