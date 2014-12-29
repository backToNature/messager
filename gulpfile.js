'use strict';

var path = require('path'),
    gulp = require('gulp'),
    code = require('gulp-code'),
    less = require('gulp-less'),
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    sprite = require('gulp-sprite-generator'),
    jslint = require('gulp-jslint'),
    gjslint = require('gulp-gjslint');

//引入包配置
var pkg = require('./package.json');

gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(gjslint())
        .pipe(gjslint.reporter('console'))
        .pipe(gjslint.reporter('fail'));
});

gulp.task('jslint', function () {
    return gulp.src(['src/messager.js'])
        .pipe(jslint({
            reporter: function (evt) {
                var msg = ' ' + evt.file;

                if (evt.pass) {
                    msg = '[PASS]' + msg;
                } else {
                    msg = '[FAIL]' + msg;
                }

                console.log(msg);
            }
        }));
});
//注册css构建任务
gulp.task('css', function () {
  return gulp.src('src/**/*.css')
    .pipe(code.lint())       //css代码检查
    .pipe(code.minify())     //css代码压缩
    .pipe(gulp.dest('build/'));
});

//注册js构建任务
gulp.task('js', function () {
  return gulp.src('src/**/*.js')
    .pipe(code.lint())       //js代码检查
    .pipe(code.minify())     //js代码压缩
    .pipe(gulp.dest('build/'));
});

//注额册js合并任务
gulp.task('concat', function() {
    gulp.src('src/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('src/'))
});

//注册less编译任务
gulp.task('less', function () {
    gulp.src('lib/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('src/'));
});

//注册coffee编译任务
gulp.task('coffee', function() {
    gulp.src('lib/**/*.coffee')
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest('src/'));
});

//注册图片合成任务


//注册一个编译任务
gulp.task('compile', ['less','coffee']);

//注册一个压缩任务
gulp.task("uglify", ['css','js']);




  //更为完整的配置文件
// 'use strict';

// var path = require('path'),
//     fs = require('fs'),
//     gulp = require('gulp'),
//     code = require('gulp-code'), // http://gitlab.alibaba-inc.com/tap/gulp-code
//     ifD = require('gulp-if'), // http://gitlab.alibaba-inc.com/x/gulp-if
//     less = require('gulp-less'), // less插件
//     clean = require('gulp-clean'), // 清空插件
//     http = require('http'),
//     pkg = require('./package.json'); // 从package.json中读取包名和版本信息

// gulp
//     .task('less', function () {  // 编译less
//         return gulp.src('./src/**/*.less')
//             .pipe(less({
//                 paths: [ path.join(__dirname, 'src') ] // import根目录
//             }))
//             .pipe(gulp.dest('src')); // 调试目录
//     })
//     .task('clean', function () { // 清空build目录
//         return gulp.src('build/**', {read: false})
//             .pipe(clean());
//     })
//     .task('css', ['clean', 'less'], function () {  // 注册css构建任务（压缩和天猫前端代码检查）
//         return gulp.src('./src/**/*.css')
//             .pipe(code.lint())
//             .pipe(gulp.dest('src')) 
//             .pipe(code.minify())
//             .pipe(gulp.dest('build'));
//     })
//     .task('js', ['clean'], function () {  // 注册js构建任务（生成seed、压缩和代码检查）
//         var pkg  = require('./package.json'); //每次都从package.json中读取包名和版本信息
//         return gulp.src('./src/**/*.js')
//             .pipe(code.lint())
//             .pipe(code.dep({
//                 name: pkg.name,
//                 path: 'http://g.tbcdn.cn/tm/' + pkg.name + '/' + pkg.version + '/',
//                 depFile: ['seed.js']   //生成的目标文件
//             }))
//             .pipe(code.minify())
//             .pipe(gulp.dest('build'));
//     })
//     .task('ifD', function(){
//         return gulp.src(['./demo/data/*.json', '!./demo/data/package.json'])
//             .pipe(ifD())
//             .pipe(gulp.dest('./doc'));
//     })
//     .task('watch', function () { // 监听文件变更
//         gulp.watch(['./src/**/*.js', './package.json', '!./src/seed.js'], ['js'])
//             .on('change', function (event) {
//                 console.log('文件' + event.path + '有变更,运行js任务');
//             });
//         gulp.watch('./src/**/*.less', ['less', 'css'])
//             .on('change', function (event) {
//                 console.log('文件' + event.path + '有变更,运行less和css任务');
//             });
//     });


// // 注册一个默认任务
// gulp.task('default', ['clean', 'less', 'css', 'js']);

