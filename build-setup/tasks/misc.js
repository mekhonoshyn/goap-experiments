import path from 'path';
import gulp from 'gulp';
import {sequence} from './utils';
import {
    srcPath,
    distPath
} from '../build-config';

gulp.task('misc:copy:sql', copySql);
gulp.task('misc:copy:stylesheets', copyStylesheets);

gulp.task('misc', sequence(['misc:copy:sql', 'misc:copy:stylesheets']));

function copySql() {
    return gulp
        .src([
            path.join(srcPath, 'db', 'worker.sql.js'),
            path.join(srcPath, 'db', 'db-snapshot.sql'),
            path.join(srcPath, 'db', 'worker.ext.sql.js')
        ])
        .pipe(gulp.dest(path.join(distPath, 'sql')));
}

function copyStylesheets() {
    return gulp
        .src([
            'node_modules/@material/button/dist/mdc.button.min.css',
            'node_modules/@material/button/dist/mdc.button.min.css.map',
            'node_modules/@material/list/dist/mdc.list.min.css',
            'node_modules/@material/list/dist/mdc.list.min.css.map'
        ])
        .pipe(gulp.dest(path.join(distPath, 'css')));
}
