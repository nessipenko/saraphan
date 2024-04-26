const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const cleanCSS = require('gulp-clean-css');
const postcss = require('gulp-postcss');

const dist = './dist';
const prod = './build'

gulp.task('copy-html', () => {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest(dist));
});

gulp.task('build-js', () => {
    return gulp.src('./src/*.js')
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'script.js'
            },
            watch: false,
            devtool: 'source-map',
            module: {
                rules: [
                    {
                        test: /\.(?:js|mjs|cjs)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', {
                                        debug: true,
                                        corejs: 3,
                                        useBuiltIns: 'usage',
                                    },
                                    ], '@babel/react'
                                ]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('build-sass', () => {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dist));
});

gulp.task('copy-assets', () => {
    return gulp.src('./src/assets/**/*')
        .pipe(gulp.dest(dist + '/assets'));
})

gulp.task('watch', () => {
    gulp.watch('./src/*.html', gulp.parallel('copy-html'));
    gulp.watch('./src/**/*.*', gulp.parallel('build-js'));
    gulp.watch('./scss/**/*.scss', gulp.parallel('build-sass'));
    gulp.watch('./src/assets/**/*', gulp.parallel('copy-assets'));
})

gulp.task('build', gulp.series('copy-html', 'build-js', 'build-sass', 'copy-assets', 'watch'));

gulp.task('prod', () => {
    gulp.src('./src/*.html')
        .pipe(gulp.dest(prod));
    gulp.src('./src/assets/**/*')
        .pipe(gulp.dest(prod + '/assets'));
    gulp.src('./src/*.js')
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'script.js'
            },
            module: {
                rules: [
                    {
                        test: /\.(?:js|mjs|cjs)$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    ['@babel/preset-env', {
                                        debug: false,
                                        corejs: 3,
                                        useBuiltIns: 'usage',
                                    },
                                    ], '@babel/react'
                                ]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(prod));

    return gulp.src('./src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS())
        .pipe(gulp.dest(prod));
})
gulp.task('default', gulp.parallel('watch', 'build'));
