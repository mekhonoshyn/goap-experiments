import Service from 'cls/Service';
import sqlService from '../../db/sql-service';
import sqlBuilder from '../../db/sql-builder';
import {
    flux,
    structureUnitsStore
} from 'app/common/bld-imports';

class StructureUnitsActions extends Service {
    fetchStructureUnits() {
        sqlService.execute('SELECT * FROM T_STRUCTURE_UNITS;')
            .then(([{values}]) => {
                const structureUnits = values.map(structureUnitConverter);

                flux.dispatch('POPULATE_STRUCTURE_UNITS', {structureUnits});
            });
    }
    createStructureUnit({parentId, title, description = '', view}) {
        return sqlService.execute(`
                INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(${parentId}, "${title}", "${description}", "${sqlBuilder.fromJSON(view)}");
                SELECT * FROM T_STRUCTURE_UNITS WHERE id = last_insert_rowid();
            `)
            .then(([{values: [data]}]) => {
                const structureUnit = structureUnitConverter(data);

                flux.dispatch('CREATE_STRUCTURE_UNIT', {structureUnit});

                this.selectStructureUnit(structureUnit.id);
            });
    }
    updateStructureUnit({id, title, description = ''}) {
        return sqlService.execute(`
                UPDATE T_STRUCTURE_UNITS SET title = "${title}", description = "${description}" WHERE id = ${id};
                SELECT * FROM T_STRUCTURE_UNITS WHERE id = ${id};
            `)
            .then(([{values: [data]}]) => {
                const structureUnit = structureUnitConverter(data);

                flux.dispatch('UPDATE_STRUCTURE_UNIT', {structureUnit});
            });
    }
    selectStructureUnit(id) {
        if (structureUnitsStore.selectionPath.includes(id)) {
            return;
        }

        const selectionPath = buildSelectionPath(id);

        flux.dispatch('POPULATE_SELECTION_PATH', {selectionPath});
    }
}

function buildSelectionPath(id) {
    const structureUnit = structureUnitsStore.findStructureUnit(id);

    if (!structureUnit) {
        return [];
    }

    const parentStructureUnit = structureUnitsStore.findStructureUnit(structureUnit.parentId);

    if (!parentStructureUnit) {
        return [id];
    }

    return [...buildSelectionPath(parentStructureUnit.id), id];
}

function structureUnitConverter([id, parentId, title, description, view]) {
    return {id, parentId, title, description, view: sqlBuilder.toJSON(view)};
}

export default StructureUnitsActions;
