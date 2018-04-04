import del from 'del';
import gulp from 'gulp';
import path from 'path';
import {
    initialize as i18nReplacerInitialize,
    finalize as i18nReplacerFinalize
} from 'i18n-replacer';
import {
    srcPath,
    distPath,
    defaultBuildName,
    customBuildName,
    buildLanguage,
    manifestName
} from '../build-config';

gulp.task('initialize', initialize);

gulp.task('finalize', finalize);

function initialize(done) {
    del.sync([`${distPath}/**`, `!${distPath}`], {dot: true});

    i18nReplacerInitialize({
        defaultBuild: defaultBuildName,
        customBuild: customBuildName,
        staticsPath: `${srcPath}/i18n/statics/${buildLanguage}/*.json`,
        dynamicsPath: `${srcPath}/i18n/dynamics/${buildLanguage}/*.json`,
        reportDirectory: 'build-reports'
    });

    done();
}

function finalize(done) {
    i18nReplacerFinalize();

    del.sync(path.join(distPath, manifestName));

    done();
}
