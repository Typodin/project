const {src, dest, task, series, watch, parallel} = require('gulp');
const rm = require('gulp-rm');
const sass = require('gulp-sass')(require('node-sass'));
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const svgSprite = require('gulp-svg-sprite');
const gulpif = require('gulp-if');

const env = process.env.NODE_ENV;

const {SRC_PATH, DIST_PATH} = require('./gulp.config');

sass.compiler = require('node-sass');

task('clean', () => {
  console.log(env);
  return src(`${DIST_PATH}/**/*`, {read: false}).pipe(rm());
});

task('copy:assets', () => {
  return src(`${SRC_PATH}/assets/**`).pipe(dest(DIST_PATH));
});

task('pug', () => {
  return src(`${SRC_PATH}/pug/*pug`)
    .pipe(sourcemaps.init())
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest(DIST_PATH));
});

task('styles', () => {
  return src([`${SRC_PATH}/styles/main.sass`])
    .pipe(gulpif(env === 'dev', sourcemaps.init()))
    .pipe(concat('main.sass'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      gulpif(
        env === 'prod',
        autoprefixer({
          cascade: false,
          overrideBrowserslist: [
            "> 1%",
            "ie >= 11",
          ]
        })
      )
    )
    .pipe(gulpif(env === 'prod', gcmq()))
    .pipe(gulpif(env === 'prod', cleanCSS()))
    .pipe(gulpif(env === 'dev',
      sourcemaps.write("./")
    ))
    .pipe(dest(`${DIST_PATH}/css/`));
});

task('scripts', () => {
  return src(`${SRC_PATH}/scripts/main/*.js`)
    .pipe(concat('main.js'))
    .pipe(gulpif(env === 'prod',
      babel({
        presets: ['@babel/env'],
      })
    ))
    .pipe(dest(`${DIST_PATH}/js/`));
})

task('icons:svg', () => {
  return src(`${SRC_PATH}/img/icons/*.svg`)
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            sprite: '../icons.svg',
          },
        },
      })
    )
    .pipe(dest(`${DIST_PATH}/img/icons/`));
});

task('server', () => {
  browserSync.init({
    server: {
      baseDir: `./${DIST_PATH}`
    },
    open: false
  });
});

task('watch', () => {
  watch(`${SRC_PATH}/assets/**`, series('copy:assets'));
  watch(`${SRC_PATH}/styles/**/*.sass`, series('styles'));
  watch(`${SRC_PATH}/pug/**/**/*.pug`, series('pug'));
  watch(`${SRC_PATH}/scripts/main/*.js`, series('scripts'));
  watch(`${SRC_PATH}/img/icons/*.svg`, series('icons:svg'));
})

task(
  'dev',
  series(
    'clean',
    parallel(
      'copy:assets',
      'styles',
      'pug',
      'scripts',
      'icons:svg',
    ),
    parallel(
      'server',
      'watch',
    ),
  )
);

task(
  'prod',
  series(
    'clean',
    parallel(
      'copy:assets',
      'styles',
      'pug',
      'scripts',
      'icons:svg',
    ),
    parallel(
      'server',
      'watch',
    ),
  ),
);