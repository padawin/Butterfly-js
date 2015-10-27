var loader = (function () {
	var modules = {},
		_loader = {};

	function _loadModule () {
		var args = [],
			definition,
			definitionName,
			a;

		if (arguments.length < 2) {
			throw 'Arguments missing';
		}
		else if (typeof(arguments[arguments.length - 1]) !== 'function') {
			throw 'The module must be a function. Got: ' + arguments[arguments.length - 1] + ', ' + typeof(arguments[arguments.length - 1]);
		}

		for (a = 0; a < arguments.length; a++) {
			if (a === 0) {
				definitionName = arguments[a];

				if (definitionName in modules) {
					throw 'The module ' + definitionName + ' already exists';
				}
			}
			else if (a == arguments.length - 1) {
				definition = arguments[a];
			}
			else if (arguments[a] in modules) {
				args.push(modules[arguments[a]]);
			}
			else {
				throw 'Unknown module ' + arguments[a] + ' included by ' + definitionName;
			}
		}

		return [definition, args, definitionName];
	}

	_loader.executeModule = function () {
		var module = _loadModule.apply(this, arguments);
		module[0].apply({}, module[1]);
	}

	_loader.addModule = function () {
		var module = _loadModule.apply(this, arguments);
		modules[module[2]] = module[0].apply({}, module[1]);
	};

	_loader.getModule = function (name) {
		if (!(name in modules)) {
			throw 'Unknown module ' + name;
		}

		return modules[name];
	};

	return _loader;
})();

if (typeof (exports) != 'undefined') {
	exports.loader = loader;
}
