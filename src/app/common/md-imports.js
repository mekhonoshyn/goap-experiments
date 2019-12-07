angular.module('builder').run(runApplication);

export let $mdDialog = null;

/* @ngInject */
function runApplication($injector) {
    $mdDialog = $injector.get('$mdDialog');
}
