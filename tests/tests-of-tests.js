/* global require */

if (typeof (require) != 'undefined') {
	var loader = require('../js/loader.js').loader;
}

loader.executeModule('TestsOfTests', 'Tests', function (Tests) {
	Tests.addSuite('tests', [
		function () {
			//Test if the method Tests.isA exists (A bit recursive logic...)

			Tests.isA(Tests.isA, 'function');
		},

		function () {
			//Test of the method Tests.isA

			var integer = 1,
				float = 1.1,
				str = 'hello',
				array = ['hello', 'world'],
				obj = {hello: 'world'},
				bool = true,
				func = function () {return 'Hello World';};

			Tests.isA(integer, 'number');
			Tests.isA(float, 'number');
			Tests.isA(str, 'string');
			Tests.isA(array, 'object');
			Tests.isA(obj, 'object');
			Tests.isA(bool, 'boolean');
			Tests.isA(func, 'function');
			Tests.isA(new func(), 'object');
		},

		function () {
			//Test if the method Tests.equals exists

			Tests.isA(Tests.equals, 'function');
		},

		function () {
			//Test of the method Tests.isA

			var integer = 1,
				float = 1.1,
				str = 'hello',
				array = ['hello', 'world'],
				obj = {hello: 'world'},
				bool = true,
				func = function () {return 'Hello World';};

			Tests.equals(integer, 1);
			Tests.equals(float, 1.1);
			Tests.equals(str, 'hello');
			Tests.equals(array, ['hello', 'world']);
			Tests.equals(obj, {hello: 'world'});
			Tests.equals(bool, true);
			Tests.equals(func, function () {return 'Hello World';});
		},

		function () {
			//Test if the method Tests.notImplemented exists

			Tests.isA(Tests.notImplemented, 'function');
		},

		// This always fails, this is the point of this method
		//~function () {
			//~//Test of the method Tests.notImplemented

			//~Tests.equals(Tests.notImplemented(), false);
		//~}

	]);
});
