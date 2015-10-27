/* global require, process */
var tests = require('../src/js/tests.js').Tests;
require('./tests-of-tests.js');
require('../src/js/loader.js');
require('../src/js/core.js');
require('../src/js/ajax.js');
require('../src/js/template.js');
require('./template.js');

process.exit(tests.runTests(console.log));
