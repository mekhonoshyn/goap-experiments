angular.module('builder').run(runApplication);

export let flux;
export let structureUnitsStore;
export let structureUnitsActions;
export let structureUnitsService;

/* @ngInject */
function runApplication($injector) {
    flux = $injector.get('flux');
    structureUnitsStore = $injector.get('structureUnitsStore');
    structureUnitsActions = $injector.get('structureUnitsActions');
    structureUnitsService = $injector.get('structureUnitsService');
}
