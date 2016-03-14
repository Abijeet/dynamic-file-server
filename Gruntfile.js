// Written 2015 by Kevin H. <nehalist.io>
// Modified 2016 by Abijeet Patro
// "Doubt kills more dreams than failure ever will" - Suzy Kassem

"use strict";

var path = require('path');

module.exports = function(grunt) {
  // jit-grunt loads all tasks - second parameter is for
  // mapping non-resolvable plugins
  require('jit-grunt')(grunt, {
    'shell'         : 'grunt-shell-spawn',
    'browserSync'   : 'grunt-browser-sync',
    'scsslint'      : 'grunt-scss-lint'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // BrowserSync configuration
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            'public_html/assets/js/*.js',
            'public_html/assets/*.ejs',
            'public_html/assets/partials/*.ejs',
          ]
        }
      },
      options: {
        watchTask: true,
        proxy: 'localhost:2368'
      }
    },

    // Watch tasks
    watch: {
      // In case of changes to the Gruntfile reload Grunt
      buildSystem: {
        files: [
          'Gruntfile.js'
        ],
        options: {
          reload: true
        }
      },

      // Compile SASS on changes
      sass: {
        files: [
          'public_html/assets/scss/*.{scss,sass}'
        ],
        tasks: ['sass'],
        options: {
          spawn: false
        }
      },

      // Install bower components on changes to the bower.json
      bower_components: {
        files: [
          'bower.json'
        ],
        tasks: ['shell:bower', 'bower_concat']
      }
    },

    // Copies font awesome fonts to the fonts directory
    copy: {
      icons: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'bower_components/font-awesome/fonts',
          src: ['*.*'],
          dest: 'fonts'
        }]
      }
    },

    // Compile SASS
    sass: {
      dist: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'public_html/assets/css/style.css': 'public_html/assets/scss/base.scss'
        }
      }
    },

    // Execution commands to run bower
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      bower: {
        command: path.resolve(process.cwd() + '/node_modules/.bin/bower --allow-root install')
      },
      bower_prune: {
        command: path.resolve(process.cwd() + '/node_modules/.bin/bower prune')
      }
    },

    // Concatenate bower components
    bower_concat: {
      all: {
        dest:     'public_html/dist/vendor.js',
        cssDest:  'public_html/dist/vendor.css',
        mainFiles: {
          'jquery' : 'public_html/dist/jquery.min.js',
        },
        dependencies: {
        },
      }
    },

    // Clean generated files
    clean: {
      all: {
        src: [
          'public_html/dist/vendor.js',
          'public_html/dist/vendor.css',
          'public_html/dist/style.css',
          '!dist/!.gitignore',
          'dist/*'
        ]
      },
    },

    // JS Validation
    jshint: {
      all: ['public_html/assets/js/*.js']
    },

    // SCSS Validation
    scsslint: {
      allFiles: ['public_html/assets/scss/*.scss']
    }
  });

  // Enable OS notifications
  grunt.loadNpmTasks('grunt-notify');


  // ===========================
  // TASKS
  // ===========================
  //
  // Most of these things are self-explanatory.
  grunt.registerTask('validate', 'Validate CSS and JS', function() {
    grunt.task.run(['jshint', 'scsslint']);
  });

  grunt.registerTask('build', 'Build the theme', function() {
    grunt.task.run('clean');
    grunt.task.run('validate');
    grunt.task.run(['sass', 'bower_concat', 'copy']);
  });

  grunt.registerTask('default', 'Default task', function() {
    // Just build if necessary
    var build = false;
    var initFiles = [
      'public_html/dist/vendor.js',
      'public_html/dist/vendor.css',
      'public_html/assets/css/style.css'
    ];
    for(var i in initFiles) {
      if( ! grunt.file.exists(initFiles[i])) {
        build = true;
        break ;
      }
    }
    if(build) {
      grunt.log.warn('Since some (important) files are missing the build task is run automatically...');
      grunt.task.run('build');
    }

    grunt.task.run('browserSync');
    grunt.task.run('watch');
  });
};
