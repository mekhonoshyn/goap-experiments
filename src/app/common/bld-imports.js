angular.module('builder').run(runApplication);

export let structureUnitsActions;

/* @ngInject */
function runApplication($injector) {
    structureUnitsActions = $injector.get('structureUnitsActions');
}
