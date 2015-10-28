if (typeof (require) != 'undefined') {
	var loader = require('../src/js/loader.js').loader;
}

loader.executeModule('coreWebTests', 'bCore', 'Tests', function (B, Tests) {
	Tests.addSuite('coreWebTests', [
		/**
		 * Test if the methods exist
		 */
		function () {
			Tests.isA(B.exists, 'function');
			Tests.isA(B.$id, 'function');
			Tests.isA(B.$sel, 'function');
			Tests.isA(B.hasClass, 'function');
			Tests.isA(B.addClass, 'function');
			Tests.isA(B.removeClass, 'function');
			Tests.isA(B.replaceClass, 'function');
			Tests.isA(B.setClass, 'function');
			Tests.isA(B.create, 'function');
			Tests.isA(B.on, 'function');
			Tests.isA(B.off, 'function');
			Tests.isA(B.appendChildren, 'function');
			Tests.isA(B.getStyle, 'function');
			Tests.isA(B.getStyleValue, 'function');
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
