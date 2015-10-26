if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('c', function () {
	var c = {},
		_parseMatch,
		regexTemplate = /\[\[(.+?)]]/g,
		savedTemplates = {},
		_template,
		_url;

	_parseMatch = function (template) {
		/*
		 * allowed commands:
		 * expression
		 * expression.attribute
		 * each expression on as loopElement template
		 * 		eg each users as user on userDesc
		 * if expression then template
		 */
		var regexExpression = /^[a-zA-Z_$][0-9a-zA-Z_$]*(?:\.[a-zA-Z_$][0-9a-zA-Z_$]*)*$/g,
			regexEach = /^each\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s+as\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s+on\s+([a-zA-Z_$\-0-9]+)$/,
			regexIf = /^if\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s+then\s+([a-zA-Z_$\-0-9]+)$/,
			match;

		if ((match = regexExpression.exec(template)) !== null) {
			return function (data) {
				var result = data, current;

				if (match[0] !== template) {
					throw "Invalid expression '" + template + "'";
				}

				match = match[0].split('.');
				while (match.length) {
					if ((current = match.shift()) != '') {
						result = result[current];
					}
				}
				return result;
			};
		}
		else if ((match = regexEach.exec(template)) !== null) {
			// match[1] -> data to loop on
			// match[2] -> name of the variable in each loop
			// match[3] -> template to display for each data loop
			return function (data) {
				var loopable = data[match[1]],
					d, result = '', dataLoop;

				if (typeof(data[match[1]]) != 'object') {
					throw "Object or array expected, " + typeof(data[match[1]]) + " got";
				}

				for (d in loopable) {
					dataLoop = {};
					dataLoop[match[2]] = loopable[d];
					result += c.compile(match[3], dataLoop);
				}

				return result;
			};

		}
		else if ((match = regexIf.exec(template)) !== null) {
			// match[1] -> data to test
			// match[3] -> template to display if the test is true
			return function (data) {
				var result = '', dataIf;
				if (data[match[1]]) {
					dataIf = {};
					dataIf[match[1]] = data[match[1]];
					result = c.compile(match[2], dataIf);
				}

				return result;
			};
		}
		else {
			throw "Invalid template expression \"" + template + "\"";
		}
	};

	_url = function (templateName, data, callback) {
		var html;
		B.Ajax.request(savedTemplates[templateName].url, {
			200: function (xhr) {
				html = xhr.responseText;
			}
		}, {}, 'GET', null, {async: false});
		savedTemplates[templateName].html = html;
	};

	_template = function (template, data) {
		var match;
		template = template.replace(regexTemplate, function () {
			// parse match
			return _parseMatch(arguments[1])(data);
		});

		return template;
	}

	c.init = function (templates) {
		savedTemplates = templates;
	};

	c.compile = function (templateName, data, callback) {
		var compiledTemplate;
		if (!(templateName in savedTemplates)) {
			throw "Invalid template \"" + templateName + "\"";
		}
		else if ('url' in savedTemplates[templateName] && !('html' in savedTemplates[templateName])) {
			_url(templateName, data);
		}

		if ('html' in savedTemplates[templateName]) {
			compiledTemplate = _template(savedTemplates[templateName].html, data);
		}
		else {
			throw "A template needs at least an url or a html body";
		}

		if (callback) {
			callback(compiledTemplate);
		}
		else {
			return compiledTemplate;
		}
	}

	return c;
});
