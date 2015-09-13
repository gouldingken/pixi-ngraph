var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', function () {
    var b = browserify({
        entries: './index.js',
        debug: true,
        standalone: 'ngraph'
    });

    b.bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/js/'));

});

//gulp.start('default');