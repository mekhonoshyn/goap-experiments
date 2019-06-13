angular.module('builder').run(runApplication);

export let $mdDialog;

/* @ngInject */
function runApplication($injector) {
    $mdDialog = $injector.get('$mdDialog');
}
