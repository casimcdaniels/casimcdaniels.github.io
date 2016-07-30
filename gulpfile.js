var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var concat      = require('gulp-concat');
var ghPages     = require('gulp-gh-pages')

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'scripts', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _assets/css into both _site/assets/css (for live injecting) and assets/css (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('_assets/css/**/*.scss')
        .pipe(sass({
            includePaths: ['_assets/css', '_assets/bower'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))

        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(gulp.dest('assets/css'))
});

/**
 * Compile files from _assets/js into both _site/assets/js (for live injecting) and assets/js (for future jekyll builds)
 */
gulp.task('scripts', function () {
    return gulp.src('_assets/js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('_site/'))
        .pipe(gulp.dest('assets/js'))
});

/**
 * Watch scss files for changes & recompile
 * Watch js files for changes & recompile, minify, etc
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_assets/css/**/*.scss', ['sass']);
    gulp.watch('_assets/js/**/*.js', ['scripts'])
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */

gulp.task('default', ['browser-sync',  'watch']);


/* Production Build */
gulp.task('build', ['jekyll-build', 'sass']);

gulp.task('deploy', ['build'], function(){
  return gulp.src('./_site/**/*')
    .pipe(ghPages({
      branch: "master"
    }))
});
