var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var concat      = require('gulp-concat');
var ghPages     = require('gulp-gh-pages')


var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Build the Jekyll Site
 */
function jekyll(done){
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( 'jekyll' , ['build', '--incremental'], {stdio: 'inherit'}).on('close', done);
}

/**
 * Compile files from _assets/css into both _site/assets/css (for live injecting) and assets/css (for future jekyll builds)
 */
function styles() {
    return gulp.src('_assets/css/**/*.scss')
        .pipe(sass({
            includePaths: ['_assets/css', '_assets/bower'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))

        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('_site/assets/css'))
        .pipe(gulp.dest('assets/css'))
}

/**
 * Compile files from _assets/js into both _site/assets/js (for live injecting) and assets/js (for future jekyll builds)
 */
function scripts() {
    return gulp.src('_assets/js/**/*.js')
        .pipe(concat('scripts.js'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('_site/'))
        .pipe(gulp.dest('assets/js'))
}

function reload(done) {
    browserSync.reload();
    done();
}
/**
 * Watch scss files for changes & recompile
 * Watch js files for changes & recompile, minify, etc
 * Watch html/md files, run jekyll & reload BrowserSync
 */
function watch() {
    gulp.watch('_assets/css/**/*.scss', styles);
    gulp.watch('_assets/js/**/*.js', scripts)
    gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html'], gulp.series(
        jekyll, reload
    ));
}

function devServer() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
}

var build = gulp.parallel(styles, scripts, jekyll);
var dev = gulp.series(build, gulp.parallel(devServer, watch));

var deploy = gulp.series(build, function(){
    return gulp.src('./_site/**/*')
        .pipe(ghPages({
        branch: "master"
    }))
});

exports.jekyll = jekyll;
exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.dev = dev
exports.deploy = deploy;


/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */

 
gulp.task('default', dev);