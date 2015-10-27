if (typeof (require) != 'undefined') {
	var loader = require('../src/js/loader.js').loader;
}

loader.executeModule('cTests', 'c', 'Tests', function (c, Tests) {
	Tests.addSuite('c', [
		/**
		 * Test if the methods exist
		 */
		function () {
			Tests.isA(c.init, 'function');
			Tests.isA(c.compile, 'function');
		},

		/**
		 * Test to compile an invalid template
		 */
		function () {
			c.init({
				validTemplate: {
					html: '<p>This is a valid template</p>'
				}
			});

			try {
				Tests.equals(c.compile('invalidTemplate'), '<p>This is a HTML static template</p>');
			}
			catch (e) {
				Tests.equals(e, 'Invalid template "invalidTemplate"');
			}
		},

		/**
		 * Test to compile a static template from an url
		 */
		function () {
			Tests.notImplemented('Call template from URL');
		},

		/**
		 * Test to compile a static template from a html
		 */
		function () {
			c.init({
				htmlTemplate: {
					html: '<p>This is a HTML static template</p>'
				}
			});

			Tests.equals(c.compile('htmlTemplate'), '<p>This is a HTML static template</p>');
		},

		/**
		 * Test to compile a template with a simple expression
		 */
		function () {
			c.init({
				template: {
					html: '<p>My name is [[name]] and I am a [[job]]</p>'
				}
			});

			Tests.equals(
				c.compile('template', {name: 'Smith', job: 'smith'}),
				'<p>My name is Smith and I am a smith</p>'
			);
		},

		/**
		 * Test to compile a template with an expression's attribute
		 */
		function () {
			c.init({
				template: {
					html: '<p>My name is [[person.name]]</p>'
				}
			});

			Tests.equals(
				c.compile('template', {person: {name: 'Smith'}}),
				'<p>My name is Smith</p>'
			);
		},

		/**
		 * Test to compile a template with two expressions on the same line
		 */
		function () {
			c.init({
				template: {
					html: '<p>My name is [[person.name]] and I am a [[person.job]]</p>'
				}
			});

			Tests.equals(
				c.compile('template', {person: {name: 'Smith', job: 'smith'}}),
				'<p>My name is Smith and I am a smith</p>'
			);
		},

		/**
		 * Test to compile a template with two expressions on different lines
		 */
		function () {
			c.init({
				template: {
					html: '<p>My name is [[person.name]],\
I am a [[person.job]]</p>'
				}
			});

			Tests.equals(
				c.compile('template', {person: {name: 'Smith', job: 'smith'}}),
				'<p>My name is Smith,\
I am a smith</p>'
			);
		},

		/**
		 * Test to compile a template with a each call
		 */
		function () {
			c.init({
				template: {
					html: '<p>My friends are [[each friends as friend on friend]]</p>'
				},
				friend: {
					html: '[[friend.name]] '
				}
			});

			Tests.equals(
				c.compile('template', {friends: [{name: 'riri'}, {name: 'fifi'}, {name: 'loulou'}]}),
				'<p>My friends are riri fifi loulou </p>'
			);
		},

		/**
		 * Test to compile a template with a if call
		 */
		function () {
			c.init({
				template: {
					html: '<p>[[if isTrue then true]][[if isFalse then false]]</p>'
				},
				'true': {
					html: 'I am true'
				},
				'false': {
					html: 'I am false'
				}
			});

			Tests.equals(
				c.compile('template', {isTrue: true, isFalse: false}),
				'<p>I am true</p>'
			);
		},

		/**
		 * Test to compile a template with an invalid placeholder
		 */
		function () {
			c.init({
				template: {
					html: '<p>I am [ [InvalidPlaceholder]]</p>'
				}
			});

			Tests.equals(
				c.compile('template', {InvalidPlaceholder: 'a valid placeholder'}),
				'<p>I am [ [InvalidPlaceholder]]</p>'
			);
		},

		/**
		 * Test to compile a template with an valid placeholder but invalid command
		 */
		function () {
			c.init({
				template: {
					html: '<p>I am [[an invalid command]]</p>'
				}
			});

			try {
				c.compile('template');
				Tests.equals(true, false);
			}
			catch (e) {
				Tests.equals(e, 'Invalid template expression "an invalid command"');
			}
		},

		/**
		 * Test to compile a template with an unprovided data
		 */
		function () {
			c.init({
				template: {
					html: '<p>I am [[theMissingOne]]</p>'
				}
			});

			try {
				Tests.equals(c.compile('template'), '<p>I am [[theMissingOne]]</p>');
			}
			catch (e) {
				Tests.equals(e.message, 'Cannot read property \'theMissingOne\' of undefined');
			}

			Tests.equals(c.compile('template', {thePresentOne: true}), '<p>I am undefined</p>');
		},
	]);
});
