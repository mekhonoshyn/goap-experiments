import path from 'path';
import gulp from 'gulp';
import {sequence} from './utils';
import {
    srcPath,
    distPath,
    imgRelPath
} from '../build-config';

gulp.task('resources:img:copy', copyImages);

gulp.task('resources:img', sequence('resources:img:copy'));

function copyImages() {
    return gulp
        .src(path.join(srcPath, imgRelPath, '**', '*'))
        .pipe(gulp.dest(path.join(distPath, imgRelPath)));
}
