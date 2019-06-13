import Controller from 'cls/Controller';
import {
    structureUnitsService
} from 'app/common/bld-imports';

class ResourceViewController extends Controller {
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

export default ResourceViewController;
