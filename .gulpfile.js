const gulp = require('gulp'),
      uglify = require('gulp-uglify-es').default,
      javascriptObfuscator = require('gulp-javascript-obfuscator');

var minify_config_js = function() {
  return gulp.src('./public/config/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/config/'));
}
exports.minify_config_js = minify_config_js;

var obfuscate_config_js = function() {
  return gulp.src('./public/config/*.js')
    .pipe(javascriptObfuscator())
    .pipe(gulp.dest('./public/dist/config/'));
}
exports.obfuscate_config_js = obfuscate_config_js;

var deploy_config_js = function() {
  return gulp.src('./public/dist/config/*.js')
    .pipe(gulp.dest('./public/config/'));
}
exports.deploy_config_js = deploy_config_js;

var minify_libs_js = function() {
  return gulp.src('./public/libs/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/libs/'));
}
exports.minify_libs_js = minify_libs_js;

var obfuscate_libs_js = function() {
  return gulp.src('./public/libs/*.js')
    .pipe(javascriptObfuscator())
    .pipe(gulp.dest('./public/dist/libs/'));
}
exports.obfuscate_libs_js = obfuscate_libs_js;

var deploy_libs_js = function() {
  return gulp.src('./public/dist/libs/*.js')
    .pipe(gulp.dest('./public/libs/'));
}
exports.deploy_libs_js = deploy_libs_js;

gulp.task('deploy_all', gulp.series(obfuscate_config_js, deploy_config_js, obfuscate_libs_js, deploy_libs_js))
