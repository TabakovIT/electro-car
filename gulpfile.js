const {src, dest, watch, parallel, series} = require('gulp');
const scss          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const autoprefixer  = require('gulp-autoprefixer');
const uglify        = require('gulp-uglify');
const imagemin      = require('gulp-imagemin');
const del           = require('del');
const fileInclude   = require('gulp-file-include');
const browserSync   = require('browser-sync').create();

function browsersync(){
    browserSync.init({
        server:{
            baseDir: 'app/'
        },
        notify:false
    })
}

function styles() {
    return src('app/src/scss/main.scss')
        .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 versions'],
            grid:true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'app/src/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())


}
function images(){
    return src('app/images/**/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest('dist/images'));
}

function watching() {
    watch(['app/src/scss/**/*.scss'],styles);
    watch(['app/src/js/**/*.js', '!app/js/main.min.js'],scripts);
    watch(['app/*.html']).on('change',browserSync.reload);
}


function build() {
    return src ([
        'app/**/*.html',
        'app/css/style.min.css',
        'app/js/main.min.js'

    ], {base: 'app'})
        .pipe(dest('dist'));

}
function cleanDist (){
    return del('dist');
}

const htmlInclude = () => {
    return src(['app/*.html'])
        .pipe(fileInclude({
            prefix: '@',
            basepath: '@file'
        }))

        .pipe(browserSync.stream());
}

exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.htmlInclude = htmlInclude;

exports.watching = watching;

exports.images = images;

exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build, htmlInclude);
exports.default = parallel(styles,scripts,htmlInclude,browsersync,watching);



