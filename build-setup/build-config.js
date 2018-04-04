import yargs from 'yargs';

const [BUILD_ENVIRONMENT_PRODUCTION, BUILD_ENVIRONMENT_DEVELOPMENT] = ['production', 'development'];
const [SRC_PATH, DIST_PATH, CSS_REL_PATH, IMG_REL_PATH, MANIFEST_NAME] = ['src', 'dist', 'css', 'img', 'manifest.json'];
const [BUILD_PRESET_ORIGINAL] = ['original'];

const {argv} = yargs
    .options({
        environment: {
            alias: ['e', 'env'],
            choices: [BUILD_ENVIRONMENT_PRODUCTION, BUILD_ENVIRONMENT_DEVELOPMENT],
            default: BUILD_ENVIRONMENT_PRODUCTION
        },
        language: {
            alias: ['l', 'lang'],
            default: 'en',
            hidden: true
        }
    });

module.exports = {
    srcPath: SRC_PATH,
    distPath: DIST_PATH,

    cssRelPath: CSS_REL_PATH,
    imgRelPath: IMG_REL_PATH,

    defaultBuildName: BUILD_PRESET_ORIGINAL,
    customBuildName: BUILD_PRESET_ORIGINAL,

    buildLanguage: argv.language,

    isProductionBuildEnvironment: argv.environment === BUILD_ENVIRONMENT_PRODUCTION,

    manifestName: MANIFEST_NAME
};
