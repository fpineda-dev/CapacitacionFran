/*Lo que estamos indicando aqui es que vamos a permitirle al node exportarle esta funcion de grunt que cuando ejecutemos
  una tarea va a poder inyectar ciertas dependencias y generar un objeto con toda la configuracion de tarea que necesitemos
  para despues justamente activarlas desde la consola del mismo servidor, Basicamente los que estamos haciendo es configurando
  la herramienta  de sass para que genere la version de distribucion buscando todos los archivos dentro de la carpeta css o que 
  termine con la extension scss los mande dentro del destino una carpeta que sea css y le pongo la extension .css */
module.exports = function (grunt) {
    require('time-grunt')(grunt)
    require('jit-grunt')(grunt, {
      useminPrepare: 'grunt-usemin'
    });

    grunt.initConfig({
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.scss'],
                    dest: 'css',
                    ext: '.css'

                }]
            }
        },
        /*Agregamos la configuracion, como va a funcionar esto cuando hagamos un cambio dentro de la carpeta css 
          y encuentre un archivo scss automaticamente se va a ejecutar la tarea que tenemos en grunt la del css*/
        watch: {
            files: ['css/*.scss'],
            tasks: ['css']
        },
        /*Para recargar automaticamente el browser */
        browserSync: {
            dev: {
                bsFiles: { //browser files
                    src: [
                        'css/*.css',
                        '*.html',
                        'js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './' //Directorio base para nuestro servidor
                    }
                }
            }
        },

        /*Para comprimir las imagenes */
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: 'images/*.{png,gif,jpg,jpeg}',
                    dest: 'dist/'
                }]
            }
        },

        copy: {
            html: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: './',
                    src: ['*.html'],
                    dest: 'dist'
                }]
            },
             fonts: {
                 files: [{
                     //for font-awesome
                     expand: true,
                     dot: true,
                     cwd: 'node_modules/open-iconic/font',
                     src: ['fonts/*.*'],
                     dest: 'dist'
                 }]
             }
        },
        
        clean: {
            build: {
                src: ['dist/']
            }
        },

        cssmin: {
            dist: {}
        },

        uglify: {
            dist: {}
        },

        filerev: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 20
            },
        
            release: {
                //filerev: release hashes(md5) all assets (images, js and css)
                //in dist directory
                    files: [{
                        src: [
                            'dist/js/*.js',
                            'dist/css/*.css',
                        ]
                    }]
                }

        },


        concat: {
            options: {
                separador: ';'
            },
            dist: {}
        },

        useminPrepare: {
            foo: {
                dest: 'dist',
                src: ['index.html', 'about.html', 'precios.html', 'contacto.html']
            },
            options: {
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js: ['uglify']
                    },
                    post: {
                        css: [{
                            name: 'cssmin',
                            createConfig: function(context, block) {
                                var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0,
                                    rebase: false
                                }
                            }
                        }]
                    }
                }
            }
        },

        usemin: {
            html: ['dist/index.html', 'dist/about.html', 'dist/precios.html', 'dist/contacto.html'],
            options: {
                assetsDir: ['dist', 'dist/css', 'dist/js']
            }
        }

        

    });
    //Agregamos la tarea y cargamos los paquetes que estamos utilizando  
    grunt.registerTask('css', ['sass']);
    grunt.registerTask('default', ['browserSync', 'watch']);
    grunt.registerTask('img:compress', ['imagemin']);
    grunt.registerTask('build', [
        'clean',
        'copy',
        'imagemin',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin'
    ])

};