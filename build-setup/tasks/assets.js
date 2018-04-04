import path from 'path';
import gulp from 'gulp';
import webpack from 'webpack';
import {sequence} from './utils';
import purgeSourceMaps from 'gulp-purge-source-maps';
import webpackConfig from '../webpack.config';
import {
    distPath,
    cssRelPath,
    isProductionBuildEnvironment,
    manifestName
} from '../build-config';

gulp.task('assets:webpack', runWebpack);

if (isProductionBuildEnvironment) {
    gulp.task('assets:purge-css-source-maps', purgeSourceMaps({
        sourcesType: 'css',
        sourcesPath: path.join(distPath, cssRelPath),
        manifestPath: path.join(distPath, manifestName)
    }));

    gulp.task('assets', sequence('assets:webpack', 'assets:purge-css-source-maps'));
} else {
    gulp.task('assets', sequence('assets:webpack'));
}

function runWebpack(done) {
    webpack(webpackConfig, done);
}
