'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
const $ = gulpLoadPlugins();
const reload = browserSync.reload;


// Template
// ========

gulp.task('template_test', () => {
    return gulp.src('test/src/index.html.twig')
        .pipe($.twig())
        .pipe($.extReplace('.html', '.html.html'))
        .pipe($.prettify({ indent_size: 2 }))
        .pipe(gulp.dest('test/dest'));

});

const report_error = error => {
  $.notify({
    title: 'An error occured with a Gulp task',
    message: 'Check you terminal for more informations'
  }).write(error);

  console.log(error.toString());
  this.emit('end');
};


// Style
// =====

const scssCompilation = (src, dest) => {
    return gulp.src(src)
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 6,
            indentWidth: 4,
        }))
        .on('error', report_error)
        .pipe($.autoprefixer({
            browsers: [
                'ie >= 10',
                'ie_mob >= 10',
                'ff >= 30',
                'chrome >= 34',
                'safari >= 7',
                'opera >= 23',
                'ios >= 7',
                'android >= 4.4',
                'bb >= 10'
            ]
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(dest));
}

gulp.task('style_test', () => {
    scssCompilation('./test/src/style.scss', './test/dest')
});
gulp.task('style_dest', () => {
    scssCompilation('./test/src/trowel-drops.scss', './dest/css')
});
gulp.task('style', ['style_test', 'style_dest']);



gulp.task('default', ['style', 'template_test']);
gulp.task('watch', ['default'], () => {
  browserSync({
    notify: false,
    logPrefix: 'Trowel Cards',
    server: ['test/dest']
  });

  gulp.watch('./**/*.scss', ['style', reload]);
  gulp.watch(['test/src/**/*.html.twig', 'src/twig/**/*.html.twig'], ['template_test', reload]);

});
