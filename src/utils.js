var hasOwnProperty = exports.hasOwnProperty = Object.prototype.hasOwnProperty;
var toString = exports.toString = Object.prototype.toString;

var each = exports.each = function (object, fn, context) {
	if (object && fn) {
		var l = object.length;
		for (var i = 0; i < l && fn.call(context, object[i], i) !== false; i++) {}
	}
};

exports.trim = function (str) {
	return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

exports.assign = function (target) {
	for (var i=1; i<arguments.length; i++) {
		var nextSource = arguments[i];

		if (nextSource != null) { // Skip over if undefined or null
			for (var nextKey in nextSource) {
				if (hasOwnProperty.call(nextSource, nextKey)) {
					target[nextKey] = nextSource[nextKey];
				}
			}
		}
	}

	return target;
};

exports.isUndefined = function (obj) { return obj === void 0; }

each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (type) {
	exports['is' + type] = function (o) {
		return toString.call(o) === '[object ' + type + ']';
	};
});

exports.throttle = function (fn, minDelay, scope) {
	var lastCall = 0;
	return function() {
		var now = +new Date();
		if (now - lastCall < minDelay) {
			return;
		}
		lastCall = now;
		fn.apply(scope, arguments);
	};
};

exports.inView = function (rect, viewport) {
	// Intersection
	return rect.right >= viewport.left &&
		rect.bottom >= viewport.top &&
		rect.left <= viewport.right &&
		rect.top <= viewport.bottom;
};
