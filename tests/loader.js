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
			try {
				loader.getModule('unexistingModule');
			}
			catch (e) {
				Tests.equals(e, 'Unknown module unexistingModule');
			}
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
		},

		/**
		 * Test of the load unexisting module
		 */
		function () {
			try {
				loader.executeModule('existing', 'nonExisting', function (foo) {
					Tests.equals(true, false);
				});
			}
			catch (e) {
				Tests.equals(e, 'Unknown module nonExisting included by existing');
			}
		},

		/**
		 * Test of the load already loaded module
		 */
		function () {
			try {
				loader.addModule('someModule', function () {});
				loader.addModule('someModule', function () {
					Tests.equals(true, false);
				});
			}
			catch (e) {
				Tests.equals(e, 'The module someModule already exists');
			}
		},

		/**
		 * Test of loading or executing a module with not enough arguments
		 */
		function () {
			try {
				loader.addModule('missingArgsModule');
			}
			catch (e) {
				Tests.equals(e, 'Arguments missing');
			}

			try {
				loader.addModule('missingArgsModule', 'foo');
			}
			catch (e) {
				Tests.equals(e, 'The module must be a function. Got: foo, string');
			}

			try {
				loader.executeModule('missingArgsModule');
			}
			catch (e) {
				Tests.equals(e, 'Arguments missing');
			}

			try {
				loader.executeModule('missingArgsModule', 'foo');
			}
			catch (e) {
				Tests.equals(e, 'The module must be a function. Got: foo, string');
			}
		}
	]);
});
