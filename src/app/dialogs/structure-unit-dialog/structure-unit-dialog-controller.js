import './scss/structure-unit-dialog.scss';
import Controller from 'cls/Controller';
import {
    structureUnitsActions
} from 'app/common/bld-imports';
import {
    $mdDialog
} from 'app/common/md-imports';

class StructureUnitDialogController extends Controller {
    constructor(...args) {
        super(...args);

        Object.assign(this, {
            editMode: Boolean(this.unitData.id)
        });
    }
    submitForm() {
        const action = this.editMode
            ? structureUnitsActions.updateStructureUnit(this.unitData)
            : structureUnitsActions.createStructureUnit(this.unitData);

        action.then(() => $mdDialog.hide());
    }
    closeDialog() {
        $mdDialog.cancel();
    }
}

export default StructureUnitDialogController;
