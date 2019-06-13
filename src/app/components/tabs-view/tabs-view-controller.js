import Controller from 'cls/Controller';
import {
    structureUnitsStore,
    structureUnitsActions,
    structureUnitsService
} from 'app/common/bld-imports';

class TabsViewController extends Controller {
    constructor(...args) {
        super(...args);

        Object.assign(this, {
            selectedIndex: -1,
            tabInstances: []
        });
    }
    $onInit() {
        console.log('$onInit:', this.instance);

        this.$di.$scope.$listenTo(structureUnitsStore, ['structureUnits'], onStructureUnitsUpdate.bind(this));
        this.$di.$scope.$listenTo(structureUnitsStore, ['selectionPath'], onSelectionPathUpdate.bind(this));
    }
    $onChanges() {
        console.log('$onChanges:', this.instance);
    }
    $onDestroy() {
        console.log('$onDestroy:', this.instance);
    }
    openCreateDialog() {
        structureUnitsService.openDialog({
            parentId: this.instance.id
        });
    }
    openEditDialog() {
        structureUnitsService.openDialog(Object.assign({}, this.instance));
    }
    onTabSelect({id}) {
        structureUnitsActions.selectStructureUnit(id);
    }
    static get $inject() {
        return ['$scope'];
    }
}

export default TabsViewController;

function onStructureUnitsUpdate() {
    this.tabInstances = structureUnitsStore.findStructureUnitChildren(this.instance.id)
        .map((tabInstance) => Object.assign({}, tabInstance));
}

function onSelectionPathUpdate() {
    const {selectionPath} = structureUnitsStore;
    const parentIndex = selectionPath.indexOf(this.instance.id);

    if (parentIndex === -1) {
        this.selectedIndex = -1;

        return;
    }

    const childId = selectionPath[parentIndex + 1];
    const childInstance = this.tabInstances.find(({id}) => id === childId);

    this.selectedIndex = this.tabInstances.indexOf(childInstance);
}
