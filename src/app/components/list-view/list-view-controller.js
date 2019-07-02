import Controller from 'cls/Controller';
import {
    $timeout
} from 'ngimport';
import structureUnitsStore from 'app/stores/structure-units-store';
import structureUnitsActions from 'app/actions/structure-units-actions';
import structureUnitsService from 'app/services/structure-units-service';

const LIST_ITEM_HEIGHT = 72;
const LIST_PADDING = 8;

class ListViewController extends Controller {
    constructor(...args) {
        super(...args);

        Object.assign(this, {
            itemInstances: [],
            selectedItem: null,

            boundOnSelectionPathUpdate: this.bindAsCallback(onSelectionPathUpdate),
            boundOnStructureUnitsUpdate: this.bindAsCallback(onStructureUnitsUpdate)
        });
    }
    $onInit() {
        console.log('$onInit:', this.instance);

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
    $postLink() {
        Object.assign(this, {
            inkBarElement: this.$di.$element.find('md-ink-bar'),
            contentElement: this.$di.$element.find('md-content')
        });
        structureUnitsStore.subscribe(this.boundOnSelectionPathUpdate);
    }
    openCreateDialog() {
        structureUnitsService.openDialog({
            parentId: this.instance.id
        });
    }
    openEditDialog() {
        structureUnitsService.openDialog(Object.assign({}, this.instance));
    }
    onItemSelect({id}) {
        structureUnitsActions.selectStructureUnit(id);
    }
    static get $inject() {
        return ['$element', '$scope'];
    }
}

export default ListViewController;

function onStructureUnitsUpdate(context) {
    context.itemInstances = structureUnitsStore.findStructureUnitChildren(context.instance.id)
        .map((itemInstance) => Object.assign({}, itemInstance));
}

function onSelectionPathUpdate(context) {
    const parentIndex = structureUnitsStore.selectionPath.indexOf(context.instance.id);

    if (parentIndex === -1) {
        resetSelection.call(context);

        return;
    }

    const childId = structureUnitsStore.selectionPath[parentIndex + 1];
    const childInstance = context.itemInstances.find(({id}) => id === childId);
    const childIndex = context.itemInstances.indexOf(childInstance);

    if (childIndex === -1) {
        resetSelection.call(context);

        return;
    }

    setSelection.call(context, childIndex);

    const [
        inkBarElementTop,
        inkBarElementBottom,
        contentElementTop,
        contentElementHeight,
        contentElementBottom
    ] = [
        childIndex * LIST_ITEM_HEIGHT + LIST_PADDING,
        childIndex * LIST_ITEM_HEIGHT + LIST_ITEM_HEIGHT + LIST_PADDING,
        context.contentElement[0].scrollTop,
        context.contentElement[0].clientHeight,
        context.contentElement[0].scrollTop + context.contentElement[0].clientHeight
    ];

    const [
        ABOVE_TOP_BORDER,
        BEHIND_BOTTOM_BORDER,
        OVER_TOP_BORDER,
        OVER_BOTTOM_BORDER
    ] = [
        inkBarElementBottom <= contentElementTop,
        inkBarElementTop >= contentElementBottom,
        inkBarElementBottom > contentElementTop && inkBarElementTop < contentElementTop,
        inkBarElementBottom > contentElementBottom && inkBarElementTop < contentElementBottom
    ];

    if (ABOVE_TOP_BORDER || BEHIND_BOTTOM_BORDER) {
        $timeout(() => {
            context.contentElement[0].scrollTop = (inkBarElementBottom + inkBarElementTop - contentElementHeight) >> 1;
        });
    } else if (OVER_TOP_BORDER) {
        $timeout(() => {
            context.contentElement[0].scrollTop = inkBarElementTop;
        });
    } else if (OVER_BOTTOM_BORDER) {
        $timeout(() => {
            context.contentElement[0].scrollTop = inkBarElementBottom - contentElementHeight;
        });
    }
}

function setSelection(childIndex) {
    this.selectedItem = this.itemInstances[childIndex];
    this.inkBarElement.css('top', `${childIndex * LIST_ITEM_HEIGHT + LIST_PADDING}px`);
}

function resetSelection() {
    this.selectedItem = null;
    this.inkBarElement.css('top', '');
}
