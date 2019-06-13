import gulp from 'gulp';
import {sequence} from './utils';

gulp.task('resources', sequence('resources:img'));

gulp.task('build', sequence('initialize', 'resources', 'assets', 'index', 'misc', 'finalize'));
