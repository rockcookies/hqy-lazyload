<%= banner %>
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

<%= contents %>

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