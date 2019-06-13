import Controller from 'cls/Controller';
import {
    structureUnitsStore
} from 'app/common/bld-imports';

class StructureRootController extends Controller {
    constructor(...args) {
        super(...args);

        this.$di.$scope.$listenTo(structureUnitsStore, ['structureUnits'], onStructureUnitsUpdate.bind(this));
    }
    static get $inject() {
        return ['$scope'];
    }
}

export default StructureRootController;

function onStructureUnitsUpdate() {
    this.rootInstance = structureUnitsStore.findStructureUnit(1);
}
