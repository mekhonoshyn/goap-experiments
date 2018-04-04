import 'css/builder.scss';

import iconsSvgLibrary from 'svg/icons.svg';

angular.module('builder', [
    'ui.router',
    'ngMaterial',
    'ngSanitize',
    'ngMessages',
    'flux'
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
        .commentDirectivesEnabled(false)
        .cssClassDirectivesEnabled(false);

    $compileProvider.onChangesTtl(CHANGES_TTL);

    $mdInkRippleProvider.disableInkRipple();
}

/* @ngInject */
function runApplication(
    $animate,
    $templateCache
) {
    $animate.enabled(false);

    $templateCache.put('svg/icons.svg', iconsSvgLibrary);
}
