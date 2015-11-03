if (typeof (require) != 'undefined') {
	var loader = require('../src/js/loader.js').loader;
}

loader.executeModule('coreCliTests', 'B', 'Tests', function (B, Tests) {
	Tests.addSuite('coreCliTests', [
		/**
		 * Test if the methods exist
		 */
		function () {
			Tests.isA(B.exists, 'function');
		},

		/**
		 * Test the exists function
		 */
		function () {
			var a;
			Tests.equals(B.exists(a), false);
			a = false;
			Tests.equals(B.exists(a), true);
			a = null;
			Tests.equals(B.exists(a), false);
			a = undefined;
			Tests.equals(B.exists(a), false);
			a = 0;
			Tests.equals(B.exists(a), true);
			a = true;
			Tests.equals(B.exists(a), true);
			a = 'a string';
			Tests.equals(B.exists(a), true);
		}
	]);
});
