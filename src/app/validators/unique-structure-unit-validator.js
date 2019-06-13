import {
    structureUnitsStore
} from 'app/common/bld-imports';

const NG_NAME = 'bldUniqueStructureUnit';
const MESSAGE_KEY = 'bld-unique-structure-unit';

export default {
    DEFINITION: [NG_NAME, uniqueStructureUnitValidator]
};

function uniqueStructureUnitValidator() {
    return {
        scope: {
            ownId: `<${NG_NAME}`,
            parent: `<${NG_NAME}Parent`
        },
        require: 'ngModel',
        link: (scope, element, attributes, ngModelCtrl) => {
            const unitsPool = [];

            scope.$watch(() => scope.parent, (parentId) => {
                const filteredUnits = structureUnitsStore.findStructureUnitChildren(parentId)
                    .filter(({id}) => id !== scope.ownId);

                unitsPool.splice(0, Number.POSITIVE_INFINITY, ...filteredUnits);

                ngModelCtrl.$validate();
            });

            ngModelCtrl.$validators[MESSAGE_KEY] = (modelValue, viewValue) => {
                if (ngModelCtrl.$isEmpty(modelValue)) {
                    return true;
                }

                const lowerCasedViewValue = String(viewValue).toLowerCase();

                if (unitsPool.some(({title}) => String(title).toLowerCase() === lowerCasedViewValue)) {
                    return false;
                }

                return true;
            };
        }
    };
}
