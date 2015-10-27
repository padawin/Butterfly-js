if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('events', function () {
	var events = {},
		Events;

	Events = {
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

	if (typeof (exports) != 'undefined') {
		exports.Events = Events;
	}

	return Events;
});

