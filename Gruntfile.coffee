'use strict'
module.exports = (grunt) ->

    process.env.NODE_ENV = "test"

    # https://github.com/kmiyashiro/grunt-mocha
    grunt.loadNpmTasks 'grunt-mocha-test'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-jshint'

    path = require 'path'

    grunt.initConfig
        watch:
            tests:
                files: ['tests/**/*.js', 'Gruntfile.coffee', 'package.json']
                tasks: ['mochaTest:test']
            lint:
                files: ['src/**/*.js', 'Gruntfile.coffee', 'package.json']
                tasks: ['jshint']
            default:
                files: ['src/**/*.js', 'tests/**/*.js', 'Gruntfile.coffee', 'package.json']
                tasks: ['default']

        mochaTest:
            test:
                options:
                    reporter: 'spec'

                src: ['tests/**/*.js']
        jshint:
            all: [
                'src/**/*.js'
                'tests/**/*.js'
            ]
            options:
                globals:
                    define      : true
                    require     : true
                    describe    : true
                    it          : true
                    beforeEach  : true
                    afterEach   : true
                    should      : true
                eqeqeq      : true
                browser     : true
                node        : true
                camelcase   : true
                immed       : true
                latedef     : true
                newcap      : true
                noarg       : true
                plusplus    : false
                undef       : true
                unused      : true
                strict      : true
                trailing    : true
                maxparams   : 6
                maxdepth    : 4
                maxlen      : 140
                maxstatements: 20 # This is just a random guess may need to be higher/lower

    grunt.registerTask 'default', ['jshint', 'mochaTest']
