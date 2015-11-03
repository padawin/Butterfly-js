/* global require, process */
var tests = require('../src/js/tests.js').Tests;
require('./tests-of-tests.js');
require('../src/js/core.js');
require('./template.js');
require('./loader.js');
require('./core-cli.js');

process.exit(tests.runTests(console.log));
