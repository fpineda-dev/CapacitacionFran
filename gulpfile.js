/*Se usa use estrict para que no sea de manera global */
'use strict'

var gulp = require('gulp'), // Coma para definir otra variable
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');
const { use } = require('browser-sync');
    

/*Configuramos nuestra primer tarea, comensamos a trabajar sobre el string de gulp, tenemos un objeto que al definir
  una tarea va a usar el concepto de string donde va a tener por una parte del source donde comienza a procesar el 
  flujo de archivo y empieza a armar lo que es el pipe o lo que es la cadena la tuberia, los procesos que se van ir
  aplicando en este caso la tarea sass hasta terminar en un dest que es donde lo va a volcar que en nuestro caso es
  la misma carpeta, nota esto me retorna una promesa agrege async await */
gulp.task('sass', async function (){
   await gulp.src('./css/*.scss')//La ruta de los archivos css
        .pipe(sass().on('error', sass.logError)) /*Ejecutamos la tarea en el pipe y ponemos el callbak del error hacemos un logError */
        .pipe(gulp.dest('./css')); //Aqui va ser el destino, el resultado de todo lo aplicado
})

/*Agregamos una tarea en este caso no instalamos nada porque ya viene con los plugin de gulp, el watch para el monitoreo
  de los archivos css, le asociamos la tarea ante cualquier cambio en el path */
gulp.task('sass:watch', function(){
    gulp.watch('./css/*.scss', ['sass']);
});

/*Aqui agregamos la tarea browser-sync le asociamos una funcion que lo que hace es buscar los html, los css, las imagenes
  los js cualquier cambio que se encuentre ahi recarga una tarea */
gulp.task('browser-sync', function(){
    var files = ['./*.html', './css/*.css', './img/*.{png, jpg, gif}', './js/*.js'];
    browserSync.init(files, {
        server: {
            baseDir: './'
        }
    });
});

/*Tarea default de gulp, al igual que con grunt es la que nos permite con un solo paso tener nuestro sitio levantado 
  aca le indicamos que corra la tarea de browser-sync y que ejecute watch
gulp.task('default', ['browser-sync'], function(){
    gulp.start('sass:watch');
}); Agregamos gulp.series porque el parametro de la lista queda obsoleto seguido de eso creamos nuestra funcion anonima
que ejecuta la tarea de watch*/

gulp.task('default', gulp.series(['browser-sync'], 'sass:watch'),function(){
  gulp.start('sass:watch');
});

/*Tarea de borrado para la carpeta dist */
gulp.task('clean', function(){
    return del(['dist']);
});
/*copyfonts los simbolos que utilizamos con los iconos no van a andar como source le especificamos de donde traemos los fonts
 luego le especificamos la extenciones de los archivos y la guardamos en dist */
gulp.task('copyfonts', function() {
  return gulp.src('./node_modules/open-iconic/font/fonts/*.{ttf,woff,eof,svg,eot, otf}*')
  .pipe(gulp.dest('dist/fonts'));
});
/*Tarea imagemin para comprimir imagenes */
gulp.task('imagemin', function(){
    return gulp.src('./images/*.{png,jpg,jpeg,gif}')//Abrimos el string indicamos el path
        .pipe(imagemin({optimization: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('dist/images'));
});
/* usemin */
gulp.task('usemin', function(){
   return gulp.src('./*.html')
       .pipe(flatmap(function(stream, file){
           return stream
               .pipe(usemin({
                   css: [rev()],
                   html: [function() { return htmlmin({collapseWhitespace: true}) }],
                   js: [uglify(), rev()], 
                   inlinejs: [uglify()],
                   inlinecss: [cleanCss(), 'concat']
               }));
       }))
       .pipe(gulp.dest('dist/'));
});

/*Definimos la tarea del build, probamos en la consola con gulp build */
gulp.task('build', gulp.series(gulp.parallel(['clean'], 'copyfonts', 'imagemin', 'usemin')), function() {
  gulp.start('copyfonts', 'imagemin', 'usemin');
});