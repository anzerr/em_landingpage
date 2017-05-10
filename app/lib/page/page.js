var _plApp;
(function($) {
	"use strict";

	var obj = function() {
		this._list = {};
	};
	obj.prototype = {
		add: function(key, func) {
			this._list[key] = func;
		},
		get: function(key) {
			return (this._list[key]);
		}
	};

	$.page = new obj();
})(_plApp || (_plApp = {}));