if (typeof (require) != 'undefined') {
	var loader = require('../src/js/loader.js').loader;
}

loader.executeModule('cTests', 'bTemplate', 'Tests', function (template, Tests) {
	Tests.addSuite('template', [
		/**
		 * Test if the methods exist
		 */
		function () {
			Tests.isA(template.init, 'function');
			Tests.isA(template.compile, 'function');
		},

		/**
		 * Test to compile an invalid template
		 */
		function () {
			template.init({
				validTemplate: {
					html: '<p>This is a valid template</p>'
				}
			});

			try {
				Tests.equals(template.compile('invalidTemplate'), '<p>This is a HTML static template</p>');
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
			template.init({
				htmlTemplate: {
					html: '<p>This is a HTML static template</p>'
				}
			});

			Tests.equals(template.compile('htmlTemplate'), '<p>This is a HTML static template</p>');
		},

		/**
		 * Test to compile a template with a simple expression
		 */
		function () {
			template.init({
				template: {
					html: '<p>My name is [[name]] and I am a [[job]]</p>'
				}
			});

			Tests.equals(
				template.compile('template', {name: 'Smith', job: 'smith'}),
				'<p>My name is Smith and I am a smith</p>'
			);
		},

		/**
		 * Test to compile a template with an expression's attribute
		 */
		function () {
			template.init({
				template: {
					html: '<p>My name is [[person.name]]</p>'
				}
			});

			Tests.equals(
				template.compile('template', {person: {name: 'Smith'}}),
				'<p>My name is Smith</p>'
			);
		},

		/**
		 * Test to compile a template with two expressions on the same line
		 */
		function () {
			template.init({
				template: {
					html: '<p>My name is [[person.name]] and I am a [[person.job]]</p>'
				}
			});

			Tests.equals(
				template.compile('template', {person: {name: 'Smith', job: 'smith'}}),
				'<p>My name is Smith and I am a smith</p>'
			);
		},

		/**
		 * Test to compile a template with two expressions on different lines
		 */
		function () {
			template.init({
				template: {
					html: '<p>My name is [[person.name]],\
I am a [[person.job]]</p>'
				}
			});

			Tests.equals(
				template.compile('template', {person: {name: 'Smith', job: 'smith'}}),
				'<p>My name is Smith,\
I am a smith</p>'
			);
		},

		/**
		 * Test to compile a template with a each call
		 */
		function () {
			template.init({
				template: {
					html: '<p>My friends are [[each friends as friend on friend]]</p>'
				},
				friend: {
					html: '[[friend.name]] '
				}
			});

			Tests.equals(
				template.compile('template', {friends: [{name: 'riri'}, {name: 'fifi'}, {name: 'loulou'}]}),
				'<p>My friends are riri fifi loulou </p>'
			);
		},

		/**
		 * Test to compile a template with a each call with a complex expression
		 */
		function () {
			template.init({
				template: {
					html: '<p>Donald\'s nephews are [[each donald.nephews as nephew on nephew]]</p>'
				},
				nephew: {
					html: '[[nephew.name]] '
				}
			});

			Tests.equals(
				template.compile('template', {
					donald: {
						nephews: [
							{name: 'riri'},
							{name: 'fifi'},
							{name: 'loulou'}
						]
					}
				}),
				'<p>Donald\'s nephews are riri fifi loulou </p>'
			);
		},

		/**
		 * Test to compile a template with a if call
		 */
		function () {
			template.init({
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
				template.compile('template', {isTrue: true, isFalse: false}),
				'<p>I am true</p>'
			);
		},

		/**
		 * Test to compile a template with a if call and a with
		 */
		function () {
			template.init({
				template: {
					html: '<p>[[if isAdmin then admin with member]]</p>'
				},
				'admin': {
					html: 'I am [[member.name]] the admin'
				}
			});

			Tests.equals(
				template.compile('template', {isAdmin: true, member: {name: 'John'}}),
				'<p>I am John the admin</p>'
			);
		},

		/**
		 * Test to compile a template with a if call and a complex expression
		 */
		function () {
			template.init({
				template: {
					html: '<p>[[if member.isAdmin then admin with member]]</p>'
				},
				'admin': {
					html: 'I am [[member.name]] the admin'
				}
			});

			Tests.equals(
				template.compile('template', {member: {isAdmin: true, name: 'John'}}),
				'<p>I am John the admin</p>'
			);
		},

		/**
		 * Test to compile a template with an invalid placeholder
		 */
		function () {
			template.init({
				template: {
					html: '<p>I am [ [InvalidPlaceholder]]</p>'
				}
			});

			Tests.equals(
				template.compile('template', {InvalidPlaceholder: 'a valid placeholder'}),
				'<p>I am [ [InvalidPlaceholder]]</p>'
			);
		},

		/**
		 * Test to compile a template with an valid placeholder but invalid command
		 */
		function () {
			template.init({
				template: {
					html: '<p>I am [[an invalid command]]</p>'
				}
			});

			try {
				template.compile('template');
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
			template.init({
				template: {
					html: '<p>I am [[theMissingOne]]</p>'
				}
			});

			try {
				Tests.equals(template.compile('template'), '<p>I am [[theMissingOne]]</p>');
			}
			catch (e) {
				if (typeof(document) == 'undefined') {
					Tests.equals(e.message, 'Cannot read property \'theMissingOne\' of undefined');
				}
				else {
					Tests.equals(e.message, 'result is undefined');
				}
			}

			Tests.equals(template.compile('template', {thePresentOne: true}), '<p>I am undefined</p>');
		},
	]);
});
