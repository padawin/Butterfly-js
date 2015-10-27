if (typeof (require) != 'undefined') {
	var loader = require('../src/js/loader.js').loader;
}

loader.executeModule('lTests', 'Tests', function (Tests) {
	Tests.addSuite('loader', [
		/**
		 * Test if the methods exist
		 */
		function () {
			Tests.isA(loader.addModule, 'function');
			Tests.isA(loader.executeModule, 'function');
			Tests.isA(loader.getModule, 'function');
		},

		/**
		 * Test of the addModule and getModule methods
		 */
		function () {
			var testModule = {
				foo: 'bar',
				test: function () {
					return 42;
				}
			};
			loader.addModule('testModule', function () {
				return testModule;
			});

			Tests.equals(testModule == loader.getModule('testModule'), true);
		},

		/**
		 * Test of the execute module
		 */
		function () {
			var a = 0;
			loader.executeModule('add', function () {
				a = a + 1;
			});

			Tests.equals(a, 1);
		}
	]);
});
