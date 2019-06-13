import sqlWorker from 'db/sql-worker';
import sqlBuilder from 'db/sql-builder';
import sqlService from 'db/sql-service';
import iconsSvgLibrary from 'svg/icons.svg';

angular.module('builder', [
    'ui.router',
    'ngMaterial',
    'ngSanitize',
    'ngMessages',
    'flux',
    'bcherny/ngimport'
])
    .config(configSecurityAndPerformance)
    .config(mdSVGConfig)
    .config(themingConfig)
    .run(runApplication);

angular.element(document).ready(() => {
    angular.bootstrap(document, ['builder'], {strictDi: true});
});

/* @ngInject */
function mdSVGConfig(
    $mdIconProvider
) {
    const ICON_SIZE = 1024;

    $mdIconProvider
        .iconSet('builder', 'svg/icons.svg', ICON_SIZE);
}

/* @ngInject */
function themingConfig(
    $mdThemingProvider
) {
    $mdThemingProvider.disableTheming(true);
}

/* @ngInject */
function configSecurityAndPerformance(
    $compileProvider,
    $mdInkRippleProvider
) {
    const CHANGES_TTL = 5;

    $compileProvider
        // .debugInfoEnabled(false)
        .commentDirectivesEnabled(false)
        .cssClassDirectivesEnabled(false);

    $compileProvider.onChangesTtl(CHANGES_TTL);

    $mdInkRippleProvider.disableInkRipple();
}

/* @ngInject */
function runApplication(
    $animate,
    $templateCache,
    structureUnitsActions
) {
    $animate.enabled(false);

    $templateCache.put('svg/icons.svg', iconsSvgLibrary);

    // sqlService.initialize()
    sqlService.connect()
        .then(() => sqlWorker.execute(`
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Goals", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Resources", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Tools", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(5, "Stove", "", "${sqlBuilder.fromJSON({type: 'resource-view'})}");
        `))
        .then(() => sqlWorker.execute(`
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Data_01", "data 01 description", "${sqlBuilder.fromJSON({type: 'list-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Data_02", "data 02 description", "${sqlBuilder.fromJSON({type: 'tabs-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Data_03", "", "${sqlBuilder.fromJSON({type: 'tabs-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Data_04", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
        `))
        .then(() => structureUnitsActions.fetchStructureUnits());
}
