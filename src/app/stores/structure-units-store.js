import Dispatcher from '../common/dispatcher';
import Store from '../common/store';
import {
    POPULATE_STRUCTURE_UNITS,
    CREATE_STRUCTURE_UNIT,
    UPDATE_STRUCTURE_UNIT,
    POPULATE_SELECTION_PATH
} from '../actions/action-types.json';

class StructureUnitsStore extends Store {
    static get reducers() {
        return {
            [POPULATE_STRUCTURE_UNITS]: populateStructureUnits,
            [CREATE_STRUCTURE_UNIT]: createStructureUnit,
            [UPDATE_STRUCTURE_UNIT]: updateStructureUnit,
            [POPULATE_SELECTION_PATH]: populateSelectionPath
        };
    }

    static get initialState() {
        return {
            structureUnits: [],
            selectionPath: []
        };
    }

    get structureUnits() {
        return this.getState().structureUnits;
    }

    get selectionPath() {
        return this.getState().selectionPath;
    }
}

export default new StructureUnitsStore(Dispatcher);

function populateStructureUnits(state, {structureUnits}) {
    return Object.assign({}, state, {structureUnits});
}

function createStructureUnit(state, {structureUnit}) {
    const changedStructureUnits = [...state.structureUnits, structureUnit];

    return Object.assign({}, state, {structureUnits: changedStructureUnits});
}

function updateStructureUnit(state, {structureUnit}) {
    const structureUnitIndex = state.structureUnits.findIndex(({id}) => id === structureUnit.id);
    const precedingStructureUnits = state.structureUnits.slice(0, structureUnitIndex);
    const followingStructureUnits = state.structureUnits.slice(structureUnitIndex + 1);

    const changedStructureUnits = [
        ...precedingStructureUnits,
        structureUnit,
        ...followingStructureUnits
    ];

    return Object.assign({}, state, {structureUnits: changedStructureUnits});
}

function populateSelectionPath(state, {selectionPath}) {
    return Object.assign({}, state, {selectionPath});
}
