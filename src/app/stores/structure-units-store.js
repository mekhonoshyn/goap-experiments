import Store from 'cls/Store';

export default {
    DEFINITION: [Store.getName(StructureUnitsStore), StructureUnitsStore]
};

function StructureUnitsStore() {
    return {
        handlers: {
            POPULATE_STRUCTURE_UNITS: 'populateStructureUnits',
            CREATE_STRUCTURE_UNIT: 'createStructureUnit',
            UPDATE_STRUCTURE_UNIT: 'updateStructureUnit',
            POPULATE_SELECTION_PATH: 'populateSelectionPath'
        },
        exports: {
            get structureUnits() {
                return [...this.state.get('structureUnits')];
            },
            get selectionPath() {
                return [...this.state.get('selectionPath')];
            },
            findStructureUnit(unitId) {
                return this.state.get('structureUnits').find(({id}) => id === unitId);
            },
            findStructureUnitChildren(unitId) {
                return this.state.get('structureUnits').filter(({parentId}) => parentId === unitId);
            }
        },
        initialize() {
            this.state = this.immutable({
                structureUnits: [],
                selectionPath: []
            });
        },
        populateStructureUnits({structureUnits}) {
            this.state.set('structureUnits', structureUnits);
        },
        createStructureUnit({structureUnit}) {
            this.state.push('structureUnits', structureUnit);
        },
        updateStructureUnit({structureUnit}) {
            const unitInstance = this.state.get('structureUnits').find(({id}) => id === structureUnit.id);
            const unitIndex = this.state.get('structureUnits').indexOf(unitInstance);

            this.state.merge(['structureUnits', unitIndex], structureUnit);
        },
        populateSelectionPath({selectionPath}) {
            this.state.set('selectionPath', selectionPath);
        }
    };
}
