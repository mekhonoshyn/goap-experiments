import sqlService from '../../db/sql-service';
import sqlBuilder from '../../db/sql-builder';
import Dispatcher from '../common/dispatcher';
import {
    POPULATE_STRUCTURE_UNITS,
    CREATE_STRUCTURE_UNIT,
    UPDATE_STRUCTURE_UNIT,
    POPULATE_SELECTION_PATH
} from '../actions/action-types.json';
import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

export default {
    fetchStructureUnits,
    createStructureUnit,
    updateStructureUnit,
    selectStructureUnit
};

function fetchStructureUnits() {
    sqlService.execute('SELECT * FROM T_STRUCTURE_UNITS;')
        .then(([{values}]) => {
            const structureUnits = values.map(structureUnitConverter);

            Dispatcher.dispatch({
                type: POPULATE_STRUCTURE_UNITS,
                data: {structureUnits}
            });
        });
}

function createStructureUnit({parentId, title, description = '', view}) {
    return sqlService.execute(`
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(${parentId}, "${title}", "${description}", "${sqlBuilder.fromJSON(view)}");
            SELECT * FROM T_STRUCTURE_UNITS WHERE id = last_insert_rowid();
        `)
        .then(([{values: [data]}]) => {
            const structureUnit = structureUnitConverter(data);

            Dispatcher.dispatch({
                type: CREATE_STRUCTURE_UNIT,
                data: {structureUnit}
            });

            selectStructureUnit(structureUnit.id);
        });
}

function updateStructureUnit({id, title, description = ''}) {
    return sqlService.execute(`
            UPDATE T_STRUCTURE_UNITS SET title = "${title}", description = "${description}" WHERE id = ${id};
            SELECT * FROM T_STRUCTURE_UNITS WHERE id = ${id};
        `)
        .then(([{values: [data]}]) => {
            const structureUnit = structureUnitConverter(data);

            Dispatcher.dispatch({
                type: UPDATE_STRUCTURE_UNIT,
                data: {structureUnit}
            });
        });
}

function selectStructureUnit(id) {
    if (structureUnitsStore.selectionPath.includes(id)) {
        return;
    }

    const selectionPath = buildSelectionPath(id);

    Dispatcher.dispatch({
        type: POPULATE_SELECTION_PATH,
        data: {selectionPath}
    });
}

function buildSelectionPath(id) {
    const structureUnit = structureUnitsService.findStructureUnit(id);

    if (!structureUnit) {
        return [];
    }

    const parentStructureUnit = structureUnitsService.findStructureUnit(structureUnit.parentId);

    if (!parentStructureUnit) {
        return [id];
    }

    return [...buildSelectionPath(parentStructureUnit.id), id];
}

function structureUnitConverter([id, parentId, title, description, view]) {
    return {id, parentId, title, description, view: sqlBuilder.toJSON(view)};
}
