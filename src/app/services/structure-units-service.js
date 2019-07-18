import {
    $mdDialog
} from 'app/common/md-imports';
import StructureUnitDialogController from 'app/dialogs/structure-unit-dialog/structure-unit-dialog-controller';
import structureUnitsStore from 'app/stores/structure-units-store';

export default {
    openDialog,
    findStructureUnit,
    findStructureUnitChildren,
    findStructureUnitSelectedChild
};

function openDialog(unitData) {
    return $mdDialog.show({
        templateUrl: 'app/dialogs/structure-unit-dialog/html/structure-unit-dialog-template.html',
        controller: StructureUnitDialogController,
        controllerAs: 'structureUnitDialogCtrl',
        bindToController: true,
        autoWrap: false,
        locals: {
            unitData
        }
    });
}

function findStructureUnit(unitId) {
    if (!unitId) {
        return null;
    }

    return structureUnitsStore.structureUnits.find(({id}) => id === unitId);
}

function findStructureUnitChildren(unitId) {
    if (!unitId) {
        return [];
    }

    return structureUnitsStore.structureUnits.filter(({parentId}) => parentId === unitId);
}

function findStructureUnitSelectedChild(unitId) {
    if (!unitId) {
        return null;
    }

    const {selectionPath} = structureUnitsStore;

    const unitIndex = selectionPath.indexOf(unitId);

    if (unitIndex >= 0 && unitIndex < selectionPath.length - 1) {
        return findStructureUnit(selectionPath[unitIndex + 1]);
    }

    return null;
}
