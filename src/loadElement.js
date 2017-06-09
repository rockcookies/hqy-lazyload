var Utils = require('./utils.js');
var Dom = require('./dom.js');

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
