if (typeof (require) != 'undefined') {
	var loader = require('./loader.js');
}

// @TODO handle request for node
loader.addModule('bAjax',
'bCore'
function (B) {
	var Ajax = {};

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
	Ajax.request = function(url, behaviorsStatus, behaviorsReadyState, method, params, options) {
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
	Ajax.update = function(nodeToUpdate, url, evalScripts, method, params, options) {
		var updateFunc = function(xhr) {
			B.$id(nodeToUpdate).innerHTML = xhr.responseText;
				if (evalScripts) {
				var i,
					scripts = getScripts(xhr.responseText);
				for (i in scripts) window.eval(scripts[i]);
			}
		};

		B.Ajax.request(url, {200 : updateFunc}, {}, method, params, options);
	};

	return Ajax;
});
