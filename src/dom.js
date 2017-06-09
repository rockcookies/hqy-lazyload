var utils = require('./utils.js');


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
