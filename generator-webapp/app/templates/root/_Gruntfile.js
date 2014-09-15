'use strict';

module.exports = function (grunt) {
	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Configurable paths for the application
	var appConfig = {
		dev: require('./bower.json').appPath || 'dev',
		prod: 'prod'
	};

	grunt.initConfig({
		yeoman: appConfig,

		// Watches files for changes and runs tasks based on the changed files
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},
			js: {
                files: ['<%= yeoman.dev %>/js/**/*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			jsTest: {
				files: ['test/spec/{,*/}*.js'],
				tasks: ['newer:jshint:test', 'karma']
			},
			ngtemplates:{
                files: ['<%= yeoman.dev %>/templates/**/*.html'],
				tasks: ['ngtemplates'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			sass: {
                files: ['<%= yeoman.dev %>/sass/**/*.{scss,sass}'],
				tasks: ['sass'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
                    '<%= yeoman.dev %>/index.html',
					'<%= yeoman.dev %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function (connect) {
						return [
							connect.static('.tmp'),
							connect().use(
								'/bower_components',
								connect.static('./bower_components')
							),
							connect.static(appConfig.dev)
						];
					}
				}
			},
			prod: {
				options: {
					open: true,
					base: '<%= yeoman.prod %>'
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish'),
                ignores:['<%= yeoman.dev %>/js/templates.js']
            },
			all: {
				src: [
					'Gruntfile.js',
					'<%= yeoman.dev %>/js/{,*/}*.js'
				]
			},
			test: {
				options: {
                    jshintrc: './test/.jshintrc'
				},
				src: ['test/spec/{,*/}*.js']
			}
		},

		// Empties folders to start fresh
		clean: {
			prod: {
				files: [{
					dot: true,
					src: [

						'<%= yeoman.prod %>/{,*/}*',
						'!<%= yeoman.prod %>/.git*'
					]
				}]
			},
			server: '.tmp'
		},

		// Automatically inject Bower components into the app
        wiredep: {
            dev: {
                src: ['<%= yeoman.dev %>/index.html'],
                exclude: ['bower_components/modernizr/modernizr.js']
            }
        },

		// Compiles Sass to CSS and generates necessary files if requested
		sass: {
			prod:{
				options:{
					outputStyle: 'compressed',
	                sourceComments: 'none'
				},
				files: {
					'<%= yeoman.dev %>/css/main.css' : '<%= yeoman.dev %>/sass/main.scss'
				}
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			html: '<%= yeoman.dev %>/index.html',
			options: {
				dest: '<%= yeoman.prod %>',
				mangle:false,
				flow: {
					html: {
						steps: {
							js: ['concat', 'uglifyjs'],
							css: ['cssmin']
						},
						post: {}
					}
				}
			}
		},

		// Performs rewrites based on filerev and the useminPrepare configuration
		usemin: {
			html: ['<%= yeoman.prod %>/{,*/}*.html'],
			css: ['<%= yeoman.prod %>/css/{,*/}*.css'],
			options: {
				assetsDirs: ['<%= yeoman.prod %>','<%= yeoman.prod %>/assets']
			}
		},
 
		uglify: {
			options: {
				report: 'min',
				mangle: false
			}
		},

		imagemin: {
			prod: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.dev %>/assets/images',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= yeoman.prod %>/assets/images'
				}]
			}
		},

		svgmin: {
			prod: {
				files: [{
					expand: true,
					cwd: '<%= yeoman.dev %>/assets/images',
					src: '{,*/}*.svg',
					dest: '<%= yeoman.prod %>/assets/images'
				}]
			}
		},

		htmlmin: {
			prod: {
				options: {
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= yeoman.prod %>',
					src: ['*.html'],
					dest: '<%= yeoman.prod %>'
				}]
			}
		},

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app2: {
                files: [{
                    expand: true,
                    src: ['<%= yeoman.dev %>/js/**/*.js']
                }]
            }
        },

        //compiles angular templates into a single file
        ngtemplates: {
            app: {
                cwd: '<%= yeoman.dev %>',
                src: 'templates/**/*.html',
                dest: '<%= yeoman.dev %>/js/templates.js',
                options: {
                    module:'<%= appname %>',
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true,
                        removeCommentsFromCDATA: true
                    }
                }
            }
        },

		// Copies remaining files to places other tasks can use
		copy: {
			prod: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= yeoman.dev %>',
					dest: '<%= yeoman.prod %>',
					src: [
						'*.{ico,png,txt}',
						'*.html',
						'css/*.css',
						'assets/{,*/}*.{webp}'
					]
				}, 
				{
					expand: true,
					cwd: '<%= yeoman.dev %>/assets/images',
					dest: '<%= yeoman.prod %>/assets/images',
					src: ['<%= yeoman.dev %>/assets/generated/*']
				}]
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [
				'sass'
			],
			test: [
				'sass'
			],
			prod: [
				'sass',
				'imagemin',
				'svgmin'
			]
		},

		// Test settings
		karma: {
			unit: {
				configFile: 'test/karma.conf.js',
				singleRun: true
			}
		}
	});

	grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
		if (target === 'prod') {
			//return grunt.task.run(['build', 'connect:prod:keepalive']);
		}

		grunt.task.run([
			'clean:server',
			'ngtemplates',
			'wiredep',
			'concurrent:server',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'clean:server',
		'ngtemplates',
		'wiredep',
		'concurrent:test',
		'clean:server',
		'karma'
	]);

	grunt.registerTask('build', [
		'clean:prod',
		'wiredep',
		'sass',
		'useminPrepare',
		'concurrent:prod',
		'concat',
		'ngAnnotate',
		'ngtemplates',
		'copy',
		'cssmin',
		'uglify',
		'usemin',
		'htmlmin',
		'clean:server'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'test',
		'build'
	]);
};