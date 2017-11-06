var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var paths = {
    pages: ['src/*.html']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/index.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("copy-assets",function(){
    return gulp.src("./src/css/playcards/faces/**/*")
    .pipe(gulp.dest("dist/faces"));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task('styles', function(done) {
    gulp.src('src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));
        done();
});

gulp.task("default",gulp.series("copy-html","copy-assets","styles", bundle));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);