/**
 * This file holds all configurations pertaining to grunt.
 */

'use strict';

module.exports = function(grunt) {

	var liveReloadPort = 35729;

	// Automatically load all grunt tasks
	require('load-grunt-tasks')(grunt);

	// All js files
	let jsFiles = ['*.js', '*.json', './lib/**/*.js'];

	// All js files
	let sassFiles = ['src/sass/**/*.scss'];

	grunt.initConfig({

		// Lint files
		jshint: {
			options: {
				esversion: 6,
				reporter: require('jshint-stylish'),
				node: true,
				expr: true,
				globals: { // Add global vars here
					//browser: false,
				}
			},
			// Run this task for all js files
			js: jsFiles
		},

		// Watch will kick off the default task on file change
		watch: {
			scripts: {
				files: jsFiles,
				tasks: ['node']
			},
			styles: {
				files: sassFiles,
				tasks: ['styles']
			}
		},

		// Beautify files
		jsbeautifier: {
			files: jsFiles,
			options: {
				js: {
					break_chained_methods: true,
					indentChar: " ",
					indentLevel: 0,
					indentSize: 2,
					indentWithTabs: true,
					jslint_happy: false,
					space_after_anon_function: false
				},
			}
		},

		// Compile Sass
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'./src/temp/css/main.css': './src/sass/main.scss'
				}
			}
		},

		// Minify CSS
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: "./src/temp/css",
					src: ["*.css", "!*.min.css"],
					dest: "./public/styles",
					ext: ".min.css"
				}]
			}
		},
	});

	// Default task
	grunt.registerTask('node', ['jshint', 'jsbeautifier']);

	// Set up CSS tasks
	grunt.registerTask("styles", ["sass", "cssmin"]);

	// Set up CSS tasks
	grunt.registerTask("default", ["node", "styles"]);


};
