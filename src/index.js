var Utils = require('./utils.js');
var Defaults = require('./defaults.js');
var Dom = require('./dom.js');
var loadElement = require('./loadElement.js');

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
