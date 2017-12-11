if (typeof (require) != 'undefined' && typeof(loader) === 'undefined') {
	var loader = require(__dirname + '/loader.js').loader;
}

loader.addModule('B', function () {
	/* CORE */
	var B = {},
		setAttribute = 'setAttribute',
		getAttribute = 'getAttribute',
		appendChild = 'appendChild',
		cattr, $id, ex;

	ex = function (v) {return v != null && v != undefined;};
	B.exists = ex;

	if (typeof(document) !== 'undefined') {
		$id = function (id) {
			if (typeof id == 'string' && id != '')
				return document.getElementById(id);
			else if (id === '' || !ex(id))
				return null;
			else
				return id;
		};
		B.$id = $id;
		B.$sel = function (selector) {
			return document.querySelectorAll(selector);
		};

		cattr = document.all ? 'className' : 'class';
		function classRegex (c) {return new RegExp('(?:\\s|^)' + c + '(?:\\s|$)');}

		B.hasClass = function (element, className) {
			element = $id(element);
			if (!ex(element) || !element[getAttribute](cattr))
				return false;
			return element[getAttribute](cattr).match(classRegex(className));
		};
		B.addClass = function (element, className) {
			element = $id(element);
			if (!B.hasClass(element, className)) {
				var cn = element[getAttribute](cattr) || '';
				element[setAttribute](cattr, cn + ' ' + className);
			}
		};
		B.removeClass = function (element, className) {
			element = $id(element);
			if (ex(element) && B.hasClass(element, className)) {
				var cn = element[getAttribute](cattr).replace(classRegex(className), ' ').trim();
				element[setAttribute](cattr, cn);
			}
		};
		B.replaceClass = function (element, oldClass, newClass, addIfNoOld) {
			element = $id(element);
			if (ex(element)) {
				var cn = element[getAttribute](cattr);
				if (B.hasClass(element, oldClass)) {
					cn = cn.replace(classRegex(oldClass), ' ' + newClass + ' ');
					element[setAttribute](cattr, cn);
				}
				else if (addIfNoOld)
					B.addClass(element, newClass);
			}
		};
		B.setClass = function (element, className) {
			element = $id(element);
			ex(element) && element[setAttribute](cattr, className);
		};

		B.create = function (tag, attributes, parent) {
			var element, k;
			if (tag == 'text')
				element = document.createTextNode(attributes['value']);
			else {
				element = document.createElement(tag);
				for (k in attributes) {
					switch(k) {
					default:
						element[setAttribute](k, attributes[k]);
						break;
					case 'id':
						if ($id(attributes[k]) == null || $id(attributes[k]) == undefined)
							element[setAttribute]('id', attributes[k]);
						break;
					case 'style':
					case 'cssText':
						// doesn't seem to work with IE
						element[setAttribute]('cssText', attributes[k]);
						element[setAttribute]('style', attributes[k]);
						break;
					case 'class':
					case 'className':
						B.setClass(element, attributes[k]);
						break;
					case 'text':
						element[appendChild](document.createTextNode(attributes[k]));
						break;
					}
				}
			}

			//if the parent is given, the created node will be put in it
			if (ex($id(parent)) || parent && ex($id(parent.element))) {
				if (!ex(parent.element)) $id(parent)[appendChild](element);
				else {
					//if the elem has to be inserted before an element
					if (ex($id(parent.before)))
						$id(parent.element).insertBefore(element, $id(parent.before));
					//else if it has to be inserted after an element
					else if (ex($id(parent.after)) && ex($id(parent.after).nextSibling))
						$id(parent.element).insertBefore(element, $id(parent.after).nextSibling);
					//else append
					else
						$id(parent.element)[appendChild](element);
				}
			}

			return element;
		};

		B.on = function (item, event, action, opt, args) {
			opt = opt || {};
			args = args || new Array();
			item = $id(item);
			// @XXX Dirty, @TODO find another way
			item[event + action] = function (evt) {
				var scope = $id('scope' in opt ? opt['scope'] : window);
				if (!opt['skipEvent'])
					action.apply(scope, args.concat([evt]));
				else
					action.apply(scope, args);
			};

			if (item.attachEvent)
				item.attachEvent('on' + event, item[event + action]);
			else if (item.addEventListener)
				item.addEventListener(event, item[event + action], opt['propagate'] == true);
		};

		B.off = function (item, event, action, opt, args) {
			opt = opt || {};
			args = args||new Array();
			item = $id(item);
			if (item.detachEvent)
				item.detachEvent('on' + event, item[event + action]);
			else if (item.removeEventListener)
				item.removeEventListener(event, item[event + action], opt['propagate'] == true);
			delete
				item[event + action];
		};

		B.appendChildren = function (element, children) {
			var k;
			element = $id(element);
			for (k = 0; k < children.length; k++)
				element[appendChild](children[k]);
		};

		B.getStyle = function (element, style) {
			element = $id(element);
			if (!ex(element))
				return;

			var y;
			if (element.currentStyle) {
				style = style.replace(/\-(\w)/g, function (m, p1) {return p1.toUpperCase();});
				y = element.currentStyle[style];
			}
			else if (window.getComputedStyle) {
				style = style.replace(/([A-Z])/g, function (p1) {return "-" + p1.toLowerCase();});
				y = document.defaultView.getComputedStyle(element, null).getPropertyValue(style);
			}

			return y;
		};

		B.getStyleValue = function (element, style) {
			return parseFloat(B.getStyle(element, style));
		};
	}
	/* END OF CORE */

	/* EVENTS */
	(function () {
		var events = {};

		B.Events = {
			on: function(event, element, callback) {
				if (!(event in events)) {
					events[event] = [];
				}

				events[event].push([element, callback]);
			},

			off: function () {
				var event = null,
					element = null,
					callback = null,
					e = 0;
				// completely unplug all the events
				if (arguments.length == 0) {
					events = {};
					return;
				}

				event = arguments[0];
				if (!(event in events)) {
					return;
				}

				// completely unplug the event
				if (arguments.length == 1) {
					events[event] = [];
					return;
				}
				// unplug all the events of the given element
				else if (arguments.length == 2) {
					element = arguments[1];
				}
				// unplug the given event/callback for the given element
				else if (arguments.length == 3) {
					element = arguments[1];
					callback = arguments[2];
				}

				while (e < events[event].length) {
					if (element == events[event][e][0]
						&& (!callback || callback && callback == events[event][e][1])
					) {
						events[event].splice(e, 1);
					}
					else {
						e++;
					}
				}
			},

			fire: function (event, args) {
				if (event in events) {
					for (var e = 0; e < events[event].length; e++) {
						events[event][e][1].apply(events[event][e][0], args);
					}
				}
			}
		};
	})();
	/* END OF EVENTS */

	/* AJAX */
	(function () {
		var _getScripts;

		/**
		 *
		 * extract all js code in <scripts> tags and return an array
		 * containing the codes
		 *
		 * str is [html part][script part][html part][script part]...
		 *
		 * [script part]s go in scripts var
		 *
		 */
		_getScripts = function(s) {
			var scriptBeginRegexp = /<script[\stype="'x\/javascri]*>/gi,
				scriptEndRegexp = /<\/[\s]*script>/gi,
				posStart, valueStart, posEnd, valueEnd, pos1, pos2, val2,
				scripts = [];

			while (s) {
				//return the position of the first script open tag (<script>)
				posStart = s.search(scriptBeginRegexp);
				valueStart = s.match(scriptBeginRegexp);
				//if a script is found, set pos1 at the script position
				pos1 = (~posStart ? posStart : s.length-1);
				if (!~posStart) {
					//stop the loop
					pos2 = s.length-1;
					val2 = 0;
				}
				else {
					posEnd = s.search(scriptEndRegexp);
					valueEnd = s.match(scriptEndRegexp);
					//if a script is found, set pos2 at the script position
					pos2 = (~posEnd ? posEnd : s.length-1);
					scripts.push(s.substring(pos1 + valueStart[0].length, pos2));
					val2 = valueEnd[0].length;
				}
				s = s.substring(pos2 + val2, s.length-1);
			}
			return scripts;
		}

		B.Ajax = {};

		/**
		 * Method to execute AJAX requests.
		 *
		 * behaviors: functions for what to do on each status and readyState.
		 * 		Associative array, with as keys the status and readyState values.
		 * 		For example, to execute a function when the status is 200,
		 * 		behaviorsStatus must be {200: function(xhr) {//do things here}}
		 * options: associative array. For the moment, there is only one possible
		 * 		value :
		 * 		- async: if true, the request will be executed in asynchronous mode.
		 *
		 */
		B.Ajax.request = function(url, behaviorsStatus, behaviorsReadyState, method, params, options) {
			behaviorsStatus = behaviorsStatus || {};
			behaviorsReadyState = behaviorsReadyState || {};
			options = options || {};

			var xhr;
			if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
			else if (window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");

			if (xhr) {
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4)
						behaviorsStatus[xhr.status] && (behaviorsStatus[xhr.status])(xhr);
					else
						behaviorsReadyState[xhr.readyState] && (behaviorsReadyState[xhr.readyState])(xhr);
				};

				xhr.open(method == 'POST' ? method : 'GET', url, B.exists(options.async) ? options.async : true);

				if (method == 'POST') {
					xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhr.setRequestHeader("Content-length", params.length);
					xhr.setRequestHeader("Connection", "close");
				}

				xhr.send(method == 'POST' ? params : null);

				return xhr;
			}
		};

		/**
		 * Shortcut method of request to update a node with the request response.
		 */
		B.Ajax.update = function(nodeToUpdate, url, evalScripts, method, params, options) {
			var ev = 'eval',
				updateFunc = function(xhr) {
				B.$id(nodeToUpdate).innerHTML = xhr.responseText;
					if (evalScripts) {
					var i,
						scripts = getScripts(xhr.responseText);
					for (i in scripts) window[ev](scripts[i]);
				}
			};

			B.Ajax.request(url, {200 : updateFunc}, {}, method, params, options);
		};
	})();
	/* END OF AJAX */

	/* TEMPLATE */
	(function () {
		var _parseMatch,
			regexTemplate = /\[\[(.+?)]]/g,
			savedTemplates = {},
			_template,
			_url;

		B.Template = {};

		_parseMatch = function (template) {
			function _parseExpression (expression, data) {
				var result = data || [], current;

				expression = expression.split('.');
				while (expression.length) {
					if ((current = expression.shift()) != '') {
						result = result[current];
					}
				}
				return result || [];
			}

			/*
			 * allowed commands:
			 * expression
			 * expression.attribute
			 * each expression on as loopElement template
			 * 		eg each users as user on userDesc
			 * if expression then template
			 */
			var regexExpression = /^[a-zA-Z_$][0-9a-zA-Z_$]*(?:\.[a-zA-Z_$][0-9a-zA-Z_$]*)*$/g,
				regexEach = /^each\s+([a-zA-Z_$][0-9a-zA-Z_$]*(?:\.[a-zA-Z_$][0-9a-zA-Z_$]*)*)\s+as\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s+on\s+([a-zA-Z_$\-0-9]+)$/,
				regexIf = /^if\s+([[a-zA-Z_$][0-9a-zA-Z_$]*(?:\.[a-zA-Z_$][0-9a-zA-Z_$]*)*)\s+then\s+([a-zA-Z_$\-0-9]+)(?:\s+with\s+([a-zA-Z_$][0-9a-zA-Z_$]*(?:\.[a-zA-Z_$][0-9a-zA-Z_$]*)*))?$/,
				match;

			if ((match = regexExpression.exec(template)) !== null) {
				return function (data) {
					var result = data, current;

					return _parseExpression(match[0], data);
				};
			}
			else if ((match = regexEach.exec(template)) !== null) {
				// match[1] -> data to loop on
				// match[2] -> name of the variable in each loop
				// match[3] -> template to display for each data loop
				return function (data) {
					var loopable = _parseExpression(match[1], data),
						d, result = '', dataLoop;


					if (typeof(loopable) != 'object') {
						throw "Object or array expected, " + typeof(loopable) + " got";
					}

					for (d in loopable) {
						dataLoop = {};
						dataLoop[match[2]] = loopable[d];
						result += B.Template.compile(match[3], dataLoop);
					}

					return result;
				};

			}
			else if ((match = regexIf.exec(template)) !== null) {
				// match[1] -> data to test
				// match[2] -> template to display if the test is true
				// match[3] -> data to use in the template
				return function (data) {
					var result = '', dataIf;
					var condition = _parseExpression(match[1], data);
					if (condition && condition.length != 0) {
						dataIf = {};
						if (match[3] !== undefined) {
							dataIf[match[3]] = _parseExpression(match[3], data);
						}
						result = B.Template.compile(match[2], dataIf);
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
			template = template.replace(regexTemplate, function () {
				// parse match
				return _parseMatch(arguments[1])(data);
			});

			return template;
		}

		B.Template.init = function (templates) {
			savedTemplates = templates;
		};

		B.Template.compile = function (templateName, data, callback) {
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
	})();
	/* END OF TEMPLATE */

	if (typeof (exports) != 'undefined') {
		exports.B = B;
	}

	// Finally, set B visible to everybody
	return B;
});
