import './scss/structure-unit-dialog.scss';
import Controller from 'cls/Controller';
import {
    $mdDialog
} from 'app/common/md-imports';
import structureUnitsActions from 'app/actions/structure-units-actions';

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
