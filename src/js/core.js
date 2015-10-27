if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('bCore', function () {
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
		function classRegex(c) {return new RegExp('( ? :\\s|^)'+c+'( ? :\\s|$)');}

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

	module.exports = B;

	// Finally, set B visible to everybody
	return B;
});
