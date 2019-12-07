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
            'node_modules/@material/list/dist/mdc.list.min.css.map',
            'node_modules/@material/tab-bar/dist/mdc.tab-bar.min.css',
            'node_modules/@material/tab-bar/dist/mdc.tab-bar.min.css.map',
            'node_modules/@material/tab-scroller/dist/mdc.tab-scroller.min.css',
            'node_modules/@material/tab-scroller/dist/mdc.tab-scroller.min.css.map',
            'node_modules/@material/tab-indicator/dist/mdc.tab-indicator.min.css',
            'node_modules/@material/tab-indicator/dist/mdc.tab-indicator.min.css.map',
            'node_modules/@material/tab/dist/mdc.tab.min.css',
            'node_modules/@material/tab/dist/mdc.tab.min.css.map',
            'node_modules/@material/dialog/dist/mdc.dialog.min.css',
            'node_modules/@material/dialog/dist/mdc.dialog.min.css.map',
            'node_modules/@material/textfield/dist/mdc.textfield.min.css',
            'node_modules/@material/textfield/dist/mdc.textfield.min.css.map',
            'node_modules/@material/menu-surface/dist/mdc.menu-surface.min.css',
            'node_modules/@material/menu-surface/dist/mdc.menu-surface.min.css.map',
            'node_modules/@material/menu/dist/mdc.menu.min.css',
            'node_modules/@material/menu/dist/mdc.menu.min.css.map',
            'node_modules/@material/select/dist/mdc.select.min.css',
            'node_modules/@material/select/dist/mdc.select.min.css.map'
        ])
        .pipe(gulp.dest(path.join(distPath, 'css')));
}
