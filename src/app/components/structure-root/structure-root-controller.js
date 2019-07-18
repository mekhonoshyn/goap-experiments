import Controller from 'cls/Controller';
import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsService from 'app/services/structure-units-service';

class StructureRootController extends Controller {
    constructor(...args) {
        super(...args);

        Object.assign(this, {
            boundOnStructureUnitsUpdate: this.bindAsCallback(onStructureUnitsUpdate)
        });
    }

    $onInit() {
        console.log('$onInit:', this.rootInstance);

        structureUnitsStore.subscribe(this.boundOnStructureUnitsUpdate);
    }

    $onDestroy() {
        console.log('$onDestroy:', this.rootInstance);

        structureUnitsStore.unSubscribe(this.boundOnStructureUnitsUpdate);
    }

    static get $inject() {
        return ['$scope'];
    }
}

export default StructureRootController;

function onStructureUnitsUpdate(context) {
    context.rootInstance = structureUnitsService.findStructureUnit(1);
}
