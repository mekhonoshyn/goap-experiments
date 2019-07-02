angular.module('builder').run(runApplication);

export let structureUnitsActions;
export let structureUnitsService;

/* @ngInject */
function runApplication($injector) {
    structureUnitsActions = $injector.get('structureUnitsActions');
    structureUnitsService = $injector.get('structureUnitsService');
}
