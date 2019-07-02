import sqlWorker from 'db/sql-worker';
import sqlBuilder from 'db/sql-builder';
import sqlService from 'db/sql-service';
import iconsSvgLibrary from 'svg/icons.svg';

angular.module('builder', [
    'ui.router',
    'ngMaterial',
    'ngSanitize',
    'ngMessages',
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

    (async () => {
        // await sqlService.initialize();

        await sqlService.connect();

        await sqlWorker.execute(`
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Goals", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(2, "get Baked Bread", "", "${sqlBuilder.fromJSON({type: 'goal-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Resources", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Tools", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(5, "Furnace", "allows to _BAKE_ or _MELT_ stuff", "${sqlBuilder.fromJSON({type: 'tool-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(1, "Processes", "", "${sqlBuilder.fromJSON({type: 'list-view'})}");
            INSERT INTO T_STRUCTURE_UNITS(parentId, title, description, view) VALUES(7, "to Heat Furnace", "changes the Furnace state to _HOT_", "${sqlBuilder.fromJSON({type: 'process-view'})}");
        `);

        structureUnitsActions.fetchStructureUnits();
    })();
}
