import fs from 'fs';
import gulp from 'gulp';
import path from 'path';
import rename from 'gulp-rename';
import compileHandlebars from 'gulp-compile-handlebars';
import {gulpPluginPath as i18nReplacerPath} from 'i18n-replacer';
import {gulpPluginPath as htmlSourceIncludePath} from 'html-source-include';
import {gulpPluginPath as flexDirectiveReplacerPath} from 'flex-directive-replacer';
import {
    srcPath,
    distPath,
    manifestName
} from '../build-config';

const i18nReplacer = require(i18nReplacerPath).default;
const htmlSourceInclude = require(htmlSourceIncludePath).default;
const flexDirectiveReplacer = require(flexDirectiveReplacerPath).default;

gulp.task('index', indexCompile);

function indexCompile(done) {
    getManifest((error, manifestData) => {
        if (error) {
            return done(error);
        }

        return gulp
            .src(path.join(srcPath, 'index.hbs'))
            .pipe(compileHandlebars(manifestData, handlebarsOptions()))
            .pipe(htmlSourceInclude())
            .pipe(flexDirectiveReplacer())
            .pipe(i18nReplacer({preset: 'html'}))
            .pipe(rename('index.html'))
            .pipe(gulp.dest(distPath))
            .on('end', done);
    });
}

function getManifest(callback) {
    fs.readFile(path.join(distPath, manifestName), 'utf8', (error, data) => {
        if (error) {
            return callback(error, null);
        }

        return callback(null, JSON.parse(data));
    });
}

function handlebarsOptions() {
    return {
        compile: {
            noEscape: true
        },
        helpers: {
            jsAsset: (alias, context) => {
                const mapping = context.data.root[alias];

                return mapping ? `<script src="${mapping}"></script>` : '';
            },
            cssAsset: (alias, context) => {
                const mapping = context.data.root[alias];

                return mapping ? `<link rel="stylesheet" href="${mapping}"/>` : '';
            }
        }
    };
}
