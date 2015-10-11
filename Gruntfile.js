module.exports = function(grunt){
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	grunt.loadTasks('tasks');

	grunt.initConfig({
		jsdoc: {
		        dist : {
			    	src: [
						'node/server.js'
					],
					jsdoc: './node_modules/.bin/jsdoc',
					options: {
						destination: 'doc'
					}
				}
		},
	});

	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.registerTask('js-doc', ['jsdoc']);
	grunt.registerTask('test', [
		'js-doc',
	]);
};

