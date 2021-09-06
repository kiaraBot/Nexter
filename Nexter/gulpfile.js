// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const gulpLoadPlugins = require('gulp-load-plugins'),
   plugins = gulpLoadPlugins();
sass.compiler = require('node-sass');

// File paths
const files = {
   scssPath: 'static/scss/**/*.scss',
   imgPath: 'static/images/**/*.png',
   cssPath: 'dist/css/**/*.css'
}

// Sass task: compiles the style.scss file into style.css
function scssTask() {
   return src(files.scssPath)
      .pipe(plugins.sourcemaps.init()) // initialize sourcemaps first
      .pipe(sass().on('error', sass.logError))
      .pipe(plugins.autoprefixer())
      .pipe(plugins.sourcemaps.write('.')) // write sourcemaps file in current directory
      .pipe(dest('dist/css')); // put final CSS in dist folder
};

// function imageminTask() {
//    return src(files.imgPath)
//       .pipe(plugins.imagemin())
//       .pipe(dest('dist/img'));
// };

// function cssMinifyTask() {
//    return src(files.cssPath)
//       .pipe(plugins.csso())
//       // .pipe(plugins.rename({
//       //    suffix: '.min'
//       // }))
//       .pipe(dest('dist/css'));
// }


/*----------- No JS Files at this time -----------*/
// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask() {
   watch([files.scssPath, files.imgPath],
      { interval: 1000, usePolling: true }, //Makes docker work
      series(
         //imageminTask, cssMinifyTask,  taken out for now
         parallel(scssTask)
      )
   );
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
// exports.default = series(
//    parallel(scssTask, imageminTask),
//    watchTask
// );

//imageminTask, cssMinifyTask,  taken out for now
exports.default = series(scssTask, watchTask);