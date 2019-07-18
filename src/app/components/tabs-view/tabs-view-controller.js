import Controller from 'cls/Controller';
import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsActions from 'app/actions/structure-units-actions';
import structureUnitsService from 'app/services/structure-units-service';

class TabsViewController extends Controller {
    constructor(...args) {
        super(...args);

        Object.assign(this, {
            selectedIndex: -1,
            tabInstances: [],

            boundOnSelectionPathUpdate: this.bindAsCallback(onSelectionPathUpdate),
            boundOnStructureUnitsUpdate: this.bindAsCallback(onStructureUnitsUpdate)
        });
    }
    $onInit() {
        console.log('$onInit:', this.instance);

        structureUnitsStore.subscribe(this.boundOnSelectionPathUpdate);
        structureUnitsStore.subscribe(this.boundOnStructureUnitsUpdate);
    }
    $onChanges() {
        console.log('$onChanges:', this.instance);
    }
    $onDestroy() {
        console.log('$onDestroy:', this.instance);

        structureUnitsStore.unSubscribe(this.boundOnSelectionPathUpdate);
        structureUnitsStore.unSubscribe(this.boundOnStructureUnitsUpdate);
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

function onStructureUnitsUpdate(context) {
    context.tabInstances = structureUnitsService.findStructureUnitChildren(context.instance.id)
        .map((tabInstance) => Object.assign({}, tabInstance));
}

function onSelectionPathUpdate(context) {
    const parentIndex = structureUnitsStore.selectionPath.indexOf(context.instance.id);

    if (parentIndex === -1) {
        context.selectedIndex = -1;

        return;
    }

    const childId = structureUnitsStore.selectionPath[parentIndex + 1];
    const childInstance = context.tabInstances.find(({id}) => id === childId);

    context.selectedIndex = context.tabInstances.indexOf(childInstance);
}
