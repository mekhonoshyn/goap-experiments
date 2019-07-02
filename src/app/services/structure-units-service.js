import {
    $mdDialog
} from 'app/common/md-imports';
import StructureUnitDialogController from 'app/dialogs/structure-unit-dialog/structure-unit-dialog-controller';

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

export default {
    openDialog
};
