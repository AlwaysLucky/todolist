var gulp = require("gulp");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
gulp.task('default', function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(['*.html', 'style/**/*.css', 'script/**/*.js'], { cwd: './' }, reload);
});