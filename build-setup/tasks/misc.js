import path from 'path';
import gulp from 'gulp';
import {sequence} from './utils';
import {
    srcPath,
    distPath
} from '../build-config';

gulp.task('misc:copy', miscCopy);

gulp.task('misc', sequence('misc:copy'));

function miscCopy() {
    return gulp
        .src([
            path.join(srcPath, 'db', 'worker.sql.js'),
            path.join(srcPath, 'db', 'db-snapshot.sql'),
            path.join(srcPath, 'db', 'worker.ext.sql.js')
        ], {
            base: path.join(srcPath, 'db')
        })
        .pipe(gulp.dest(path.join(distPath, 'sql')));
}
