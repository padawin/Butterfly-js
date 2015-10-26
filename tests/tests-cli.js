/* global require, process */
var tests = require('./tests.js').Tests;
require('./tests-of-tests.js');
require('../js/loader.js');
require('../js/template.js');
require('./template.js');

process.exit(tests.runTests(console.log));
