import Controller from 'cls/Controller';

import structureUnitsService from 'app/services/structure-units-service';

class GoalViewController extends Controller {
    $onInit() {
        console.log('$onInit:', this.instance);
    }
    $onChanges() {
        console.log('$onChanges:', this.instance);
    }
    $onDestroy() {
        console.log('$onDestroy:', this.instance);
    }
    openEditDialog() {
        structureUnitsService.openDialog(Object.assign({}, this.instance));
    }
}

export default GoalViewController;
