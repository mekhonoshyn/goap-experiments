import Controller from 'cls/Controller';
import {
    structureUnitsStore,
    structureUnitsActions,
    structureUnitsService
} from 'app/common/bld-imports';
import {
    $timeout
} from 'ngimport';

const LIST_ITEM_HEIGHT = 72;
const LIST_PADDING = 8;

class ListViewController extends Controller {
    constructor(...args) {
        super(...args);

        Object.assign(this, {
            itemInstances: [],
            selectedItem: null
        });
    }
    $onInit() {
        console.log('$onInit:', this.instance);

        this.$di.$scope.$listenTo(structureUnitsStore, ['structureUnits'], onStructureUnitsUpdate.bind(this));
    }
    $onChanges() {
        console.log('$onChanges:', this.instance);
    }
    $onDestroy() {
        console.log('$onDestroy:', this.instance);
    }
    $postLink() {
        Object.assign(this, {
            inkBarElement: this.$di.$element.find('md-ink-bar'),
            contentElement: this.$di.$element.find('md-content')
        });
        this.$di.$scope.$listenTo(structureUnitsStore, ['selectionPath'], onSelectionPathUpdate.bind(this));
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

function onStructureUnitsUpdate() {
    this.itemInstances = structureUnitsStore.findStructureUnitChildren(this.instance.id)
        .map((itemInstance) => Object.assign({}, itemInstance));
}

function onSelectionPathUpdate() {
    const {selectionPath} = structureUnitsStore;
    const parentIndex = selectionPath.indexOf(this.instance.id);

    if (parentIndex === -1) {
        resetSelection.call(this);

        return;
    }

    const childId = selectionPath[parentIndex + 1];
    const childInstance = this.itemInstances.find(({id}) => id === childId);
    const childIndex = this.itemInstances.indexOf(childInstance);

    if (childIndex === -1) {
        resetSelection.call(this);

        return;
    }

    setSelection.call(this, childIndex);

    const [
        inkBarElementTop,
        inkBarElementBottom,
        contentElementTop,
        contentElementHeight,
        contentElementBottom
    ] = [
        childIndex * LIST_ITEM_HEIGHT + LIST_PADDING,
        childIndex * LIST_ITEM_HEIGHT + LIST_ITEM_HEIGHT + LIST_PADDING,
        this.contentElement[0].scrollTop,
        this.contentElement[0].clientHeight,
        this.contentElement[0].scrollTop + this.contentElement[0].clientHeight
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
            this.contentElement[0].scrollTop = (inkBarElementBottom + inkBarElementTop - contentElementHeight) >> 1;
        });
    } else if (OVER_TOP_BORDER) {
        $timeout(() => {
            this.contentElement[0].scrollTop = inkBarElementTop;
        });
    } else if (OVER_BOTTOM_BORDER) {
        $timeout(() => {
            this.contentElement[0].scrollTop = inkBarElementBottom - contentElementHeight;
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