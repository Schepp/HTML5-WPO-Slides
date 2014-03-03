module.exports = function (grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg: require('./package'),

		sass: {
			dev: {
				options: {
					unixNewlines: true,
					style: 'expanded'
				},
				files: {
                    'assets/stylesheets/screen.css': 'src/sass/screen.scss'
				}
			},
			deploy: {
				options: {
					style: 'compressed'
				},
				files: {
					'assets/stylesheets/screen.min.css': 'src/sass/screen.scss'
				}

			}
		},

        autoprefixer: {
            options: {
                browsers: ['last 2 version', '> 2%', 'ie 8', 'ie 9']
            },
            default: {
                src: ['assets/stylesheets/screen.css','assets/stylesheets/screen.min.css']
            }
        },

        concat: {
            options: {
                separator: ';\r'
            },
            deploy: {
                src: [
                    'src/javascripts/jquery-1.10.2.js',
                    'src/javascripts/vendor/*/*.js',
                    'src/javascripts/vendor/*.js',
                    'src/javascripts/modules/**/*.js',
                    'src/javascripts/script.js'
                ],
                dest: 'assets/javascripts/script.js'
            }
        },

        uglify: {
			deploy: {
                src: [
                    'src/javascripts/jquery-1.10.2.js',
                    'src/javascripts/vendor/**/*.js',
                    'src/javascripts/modules/**/*.js',
                    'src/javascripts/script.js'
                ],
                dest: 'assets/javascripts/script.min.js',
				options: {}
			}
		},

		watch: {

			sass: {
				files: ['src/sass/**/*.scss'],
				tasks: [
                    'sass',
                    'autoprefixer'
                ]
			},

			js: {
				files: [
					'Gruntfile.js',
					'src/javascripts/**/*.js'
				],
				tasks: [
                    'concat',
                    'uglify'
                ]
			}
		}
	});

	// Load some stuff
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');

	// A task for deployment
	grunt.registerTask('deploy', [
		'sass:deploy',
        'autoprefixer',
		'uglify'
	]);

	// Default task
	grunt.registerTask('default', [
		'sass:dev',
        'autoprefixer',
        'concat'
	]);

};
