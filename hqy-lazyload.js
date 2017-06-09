/* hqy-lazyload@v0.0.2 | https://github.com/Rockcookies/hqy-lazyload | A fast lightweight pure JavaScript script for lazy loading and multi-serving images, iframes, videos and more. */

!(function () {
var __modules__ = {};

function __include__ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], __include__, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function __namespace__ (path, fn) {
    __modules__[path] = fn;
}

__namespace__('./defaults.js', function (__include__, exports, module) {

module.exports = {
	root: document,
	container: false,
	elements: '.hqy-lazy',
	success: false,
	error: false,
	offset: 2,
	separator: ',',
	loadingClass: 'hqy-loading',
	successClass: 'hqy-loaded',
	errorClass: 'hqy-error',
	breakpoints: false,
	loadInvisible: false,
	validateDelay: 25,
	saveViewportOffsetDelay: 50,
	srcset: 'data-srcset',
	src: 'data-src'
};

});
__namespace__('./dom.js', function (__include__, exports, module) {

var utils = __include__("./utils.js");


var setAttr = exports.setAttr = function (ele, attr, value){
	ele.setAttribute(attr, value);
};

var getAttr = exports.getAttr = function (ele, attr) {
	return ele.getAttribute(attr);
};

var removeAttr = exports.removeAttr = function (ele, attr){
	ele.removeAttribute(attr);
};

var regClassCache = {};

var hasClass = exports.hasClass = function (ele, cls) {
	if(!regClassCache[cls]){
		regClassCache[cls] = new RegExp('(\\s|^)'+cls+'(\\s|$)');
	}
	return regClassCache[cls].test(getAttr(ele, 'class') || '') && regClassCache[cls];
};

exports.addClass = function(ele, cls) {
	if (!hasClass(ele, cls)){
		setAttr(ele, 'class', utils.trim(getAttr(ele, 'class') || '') + ' ' + cls);
	}
};

exports.removeClass = function (ele, cls) {
	var reg;
	if ((reg = hasClass(ele,cls))) {
		setAttr(ele, 'class', (getAttr(ele, 'class') || '').replace(reg, ' '));
	}
};

exports.toElements = function (elements) {
	if (utils.isString(elements)) {
		return exports.querySelectorAll(elements);
	} else if (elements && elements.length) {
		var nodelist = [];
		for (var i = elements.length; i--; nodelist.unshift(elements[i])) {}
		return nodelist;
	} else if (elements) {
		return [elements];
	} else {
		return [];
	}
};


exports.querySelectorAll = function (q, res) {
	if (document.querySelectorAll) {
		res = document.querySelectorAll(q);
	} else {
		var d=document
		, a=d.styleSheets[0] || d.createStyleSheet();
		a.addRule(q,'f:b');
		for(var l=d.all,b=0,c=[],f=l.length;b<f;b++)
			l[b].currentStyle.f && c.push(l[b]);

		a.removeRule(0);
		res = c;
	}
	return res;
};

exports.contains = function (parentEl, el, _undef) {
	// 第一个节点是否包含第二个节点
	//contains 方法支持情况：chrome+ firefox9+ ie5+, opera9.64+(估计从9.0+),safari5.1.7+
	if (parentEl == el) {
		return true;
	}
	if (!el || !el.nodeType || el.nodeType != 1) {
		return false;
	}
	if (parentEl.contains) {
		return parentEl.contains(el);
	}
	if (parentEl.compareDocumentPosition) {
		return !!(parentEl.compareDocumentPosition(el) & 16);
	}
	var prEl = el.parentNode;
	while(prEl && prEl != _undef) { // _undef 在这里是 undefined 的值
		if (prEl == parentEl)
			return true;
		prEl = prEl.parentNode;
	}
	return false;
};

exports.equal = function (ele, str) {
	return ele.nodeName.toLowerCase() === str;
};

exports.bindEvent = function  (ele, type, fn) {
	if (ele.attachEvent) {
		ele.attachEvent && ele.attachEvent('on' + type, fn);
	} else {
		ele.addEventListener(type, fn, { capture: false, passive: true });
	}
};

exports.unbindEvent = function  (ele, type, fn) {
	if (ele.detachEvent) {
		ele.detachEvent && ele.detachEvent('on' + type, fn);
	} else {
		ele.removeEventListener(type, fn, { capture: false, passive: true });
	}
};


});
__namespace__('./index.js', function (__include__, exports, module) {

var Utils = __include__("./utils.js");
var Defaults = __include__("./defaults.js");
var Dom = __include__("./dom.js");
var loadElement = __include__("./loadElement.js");

function HqyLazyload (options) {
	this.init(options);
};

module.exports = HqyLazyload;

// device pixel ratio
// not supported in IE10 - https://msdn.microsoft.com/en-us/library/dn265030(v=vs.85).aspx
var isRetina = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1;

var saveViewportOffset = function(viewport, offset) {
	viewport.bottom = (window.innerHeight || document.documentElement.clientHeight) + offset;
	viewport.right = (window.innerWidth || document.documentElement.clientWidth) + offset;
};

Utils.assign(HqyLazyload.prototype, loadElement, {
	init: function (options) {
		options = options || {};

		this.options = {};
		for (var key in Defaults) {
			this.options[key] = options[key] || Defaults[key];
		}

		// initialize context
		this.initContext();

		// setup
		this.render();
	},

	initContext: function () {
		var options = this.options;

		var context = this.context = {
			attrSrc: 'src',
			attrSrcset: 'srcset',
			source: options.src,
			elements: [],
			container: Dom.toElements(options.container)[0] || false,
			destroyed: true,
			isRetina: isRetina,
			viewport: {
				top: 0 - options.offset,
				left: 0 - options.offset
			},
			validateT: Utils.throttle(function() {
				this.validate();
			}, options.validateDelay, this),
			saveViewportOffsetT: Utils.throttle(function() {
				saveViewportOffset(context.viewport, options.offset);
			}, options.validateDelay, this)
		};

		// init viewport
		saveViewportOffset(context.viewport, options.offset);

		// handle multi-served image src (obsolete)
		Utils.each(options.breakpoints, function (object) {
			if (object.width >= window.screen.width) {
				context.source = object.src;
				return false;
			}
		});
	},

	render: function () {
		var options = this.options;
		var context = this.context;

		// First we create an array of elements to lazy load
		context.elements = Dom.toElements(options.elements);

		// Then we bind resize and scroll events if not already binded
		if (context.destroyed) {
			context.destroyed = false;

			if (context.container) {
				Dom.bindEvent(context.container, 'scroll', context.validateT);
			}

			Dom.bindEvent(window, 'resize', context.saveViewportOffsetT);
			Dom.bindEvent(window, 'resize', context.validateT);
			Dom.bindEvent(window, 'scroll', context.validateT);
		}

		// And finally, we start to lazy load.
		this.validate();
	},

	destroy: function () {
		var options = this.options;
		var context = this.context;

		if (context.container) {
			Dom.unbindEvent(context.container, 'scroll', context.validateT);
		}

		Dom.unbindEvent(window, 'scroll', context.validateT);
		Dom.unbindEvent(window, 'resize', context.validateT);
		Dom.unbindEvent(window, 'resize', context.saveViewportOffsetT);

		context.elements = [];
		context.destroyed = true;
	},

	validate: function () {
		var options = this.options;
		var context = this.context;
		var elements = context.elements;
		var count = elements.length;

		Utils.each(elements, function (ele) {
			if (
				Dom.hasClass(ele, context.loadingClass) ||
				Dom.hasClass(ele, options.successClass) ||
				Dom.hasClass(ele, options.errorClass)
			) {
				count--;
				return;
			}

			if (this.elementInView(ele)) {
				this.loadElement(ele);
				count--;
				return;
			}
		}, this);

		if (count <= 0) {
			this.destroy();
		}
	},

	elementInView: function (ele) {
		var options = this.options;
		var context = this.context;
		var viewport = context.viewport;
		var container = context.container;
		var rect = ele.getBoundingClientRect();


		// Is element inside a container?
		if (Dom.container && Dom.contains(container, ele)) {
			var containerRect = container.getBoundingClientRect();

			// Is container in view?
			if (inView(containerRect, viewport)) {
				var top = containerRect.top - options.offset;
				var right = containerRect.right + options.offset;
				var bottom = containerRect.bottom + options.offset;
				var left = containerRect.left - options.offset;
				var containerRectWithOffset = {
					top: top > viewport.top ? top : viewport.top,
					right: right < viewport.right ? right : viewport.right,
					bottom: bottom < viewport.bottom ? bottom : viewport.bottom,
					left: left > viewport.left ? left : viewport.left
				};

				// Is element in view of container?
				return Utils.inView(rect, containerRectWithOffset);
			} else {
				return false;
			}
		} else {
			return Utils.inView(rect, viewport);
		}
	},

	load: function (elements, force) {
		var context = this.context;

		context.elements = Dom.toElements(elements);
		Utils.each(elements, function(el) {
			this.loadElement(element, force);
		}, this);
	}
});


});
__namespace__('./loadElement.js', function (__include__, exports, module) {

var Utils = __include__("./utils.js");
var Dom = __include__("./dom.js");

function process (el, dataSrc, options, context) {
	var that = this;
	var isImage = Dom.equal(el, 'img');
	var dataSrcSplitted = dataSrc.split(options.separator);
	var src = dataSrcSplitted[context.isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
	var srcset = Dom.getAttr(el, options.srcset);
	var parent = el.parentNode;
	var isPicture = parent && Dom.equal(parent, 'picture');

	// An item with src like iframe, unity games, simpel video etc
	if (!isImage && !Utils.isUndefined(el.src)) {
		el.src = src;
		this.loadElementSuccess(el);
		return;
	}


	var img = new Image();
	// using EventListener instead of onerror and onload
	// due to bug introduced in chrome v50
	// (https://productforums.google.com/forum/#!topic/chrome/p51Lk7vnP2o)
	var onErrorHandler = function () {
		that.loadElementError(el, 'invalid');
		Dom.unbindEvent(img, 'error', onErrorHandler);
		Dom.unbindEvent(img, 'load', onSuccessHandler);
	};

	var onSuccessHandler = function () {
		// Is element an image
		if (isImage) {
			if(!isPicture) {
				that.handleSrcsetElement(el, src, srcset);
			}
		// or background-image
		} else {
			el.style.backgroundImage = 'url("' + src + '")';
		}
		that.loadElementSuccess(el);
		Dom.unbindEvent(img, 'error', onErrorHandler);
		Dom.unbindEvent(img, 'load', onSuccessHandler);
	};

	// Picture element
	if (isPicture) {
		img = el; // Image tag inside picture element wont get preloaded
		Utils.each(parent.getElementsByTagName('source'), function(source) {
			this.handleSourceElement(source, context.attrSrcset, options.srcset);
		}, this);
	}

	Dom.addClass(el, options.loadingClass);
	Dom.bindEvent(img, 'error', onErrorHandler);
	Dom.bindEvent(img, 'load', onSuccessHandler);
	this.handleSrcsetElement(img, src, srcset); // Preload
};


module.exports = {
	handleSourceElement: function (el, attr, dataAttr) {
		var dataSrc = Dom.getAttr(el, dataAttr);

		if (dataSrc) {
			Dom.setAttr(el, attr, dataSrc);
		}
	},

	handleSrcsetElement: function (el, src, srcset) {
		if(srcset) {
			Dom.setAttr(el, this.context.attrSrcset, srcset); //srcset
		}
		el.src = src; //src
	},

	loadElementSuccess: function (el) {
		var options = this.options;

		Dom.addClass(el, options.successClass);
		Dom.removeClass(el, options.loadingClass);
		if (options.success) options.success(el);
	},

	loadElementError: function (el, msg) {
		var options = this.options;

		if (options.error) options.error(el, msg);
		Dom.addClass(el, options.errorClass);
		Dom.removeClass(el, options.loadingClass);
	},

	loadElement: function (el, force) {
		var options = this.options;
		var context = this.context;
		var that = this;

		// if element is visible, not loaded or forced
		if (force || options.loadInvisible || (el.offsetWidth > 0 && el.offsetHeight > 0)) {
			// fallback to default 'data-src'
			var dataSrc = Dom.getAttr(el, context.source) || Dom.getAttr(el, options.src);

			if (dataSrc) {
				process.call(this, el, dataSrc, options, context);
			// video and others
			} else {
				Dom.addClass(el, options.loadingClass);
				// video with child source
				if (Dom.equal(el, 'video')) {
					Utils.each(el.getElementsByTagName('source'), function(source) {
						this.handleSourceElement(source, context.attrSrc, options.src);
					}, this);
					el.load();
					this.loadElementSuccess(el);
				} else {
					this.loadElementError(el, 'missing');
				}
			}
		}
	}
};


});
__namespace__('./utils.js', function (__include__, exports, module) {

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


});

if (typeof define === 'function' && define.amd) {
    // AMD. Register lazyload as an anonymous module
    define(__include__('./index.js'));
} else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = __include__('./index.js');
} else {
    // Browser globals. Register lazyload on window
    window.HqyLazyload = __include__('./index.js');
}


})();