var _plApp;
(function($) {
	"use strict";

	var _Cookies = {
		getItem: function(sKey) {
			if (!sKey) {
				return null;
			}
			return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
		},
		setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
			if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
				return false;
			}
			var sExpires = '';
			if (vEnd) {
				switch (vEnd.constructor) {
					case Number:
						sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
						break;
					case String:
						sExpires = '; expires=' + vEnd;
						break;
					case Date:
						sExpires = '; expires=' + vEnd.toUTCString();
						break;
				}
			}
			document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
			return true;
		},
		removeItem: function(sKey, sPath, sDomain) {
			if (!this.hasItem(sKey)) {
				return false;
			}
			document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
			return true;
		},
		hasItem: function(sKey) {
			if (!sKey) {
				return false;
			}
			return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
		},
		keys: function() {
			var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/);
			for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
				aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
			}
			return aKeys;
		}
	}; // --


	var handle = {
		indexedDB: (window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB || null),
		IDBTransaction: (window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction ||  null),
		IDBKeyRange: (window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange || null)
	};

	var _config = {
		name: '_localdb',
		version: 1,
		key: 'GH879FD9GI5RIG549E0IO34JG4PTK430GJIRK'
	};

	var type = 'cookie';
	if ($.defined(handle.indexedDB)) {
		type = 'indexedDB';
	} else if ($.defined(Storage) && defined(Window.localStorage) && defined(Window.sessionStorage)) {
		type = 'webStorage';
	} else if (false) { // disabled
		type = 'webSQL'; // see if needed
	}


	/* ---------------------- */
	var _wrapper = function(core, path, data) {
		this._core = core;
		this._path = path;
		this._data = data;
	};
	_wrapper.prototype = {
		save: function() {
			var route = this._path.split('.'), loc = this._core._database;
			if (this._path != '') {
				for (var i in route) {
					if (i == (route.length + 1)) {
						loc[route[i]] = this._data;
					} else {
						loc = loc[route[i]];
					}
				}
			} else {
				this._core._database = $.schema.merge().deep(this._core._database, this._data);
			}
			return (this._core.save());
		},
		data: function() {
			return (this._data);
		},
		set: function(data) {
			this._data = $.schema.merge().deep(this._data, data);
			return (this);
		}
	};

	var _base = function() {};
	_base.prototype = {
		open: function() {
			$.console.error('method did not get init on new obj');
			return (new $.promise());
		},
		get: function(p) {
			var self = this;
			return (this.open().then(function() {
				var path = (p || ''), route = path.split('.'), loc = self._database;
				if (path != '') {
					for (var i in route) {
						if ($.defined(loc[route[i]])) {
							loc = loc[route[i]];
						} else {
							return ((new $.promise).reject('wrong path'));
						}
					}
				}
				return (new _wrapper(self, path, loc));
			}));
		}
	};
	/* ---------------------- */


	/* ---------- indexedDB ------------ */
	var indexedDB = function() {
		var self = this;

		this._db = null;
		this._loaded = false;
		this._event = new $.event();
		this._database = null;
		this._struct = {key: 1, data: {}};

		var req = handle.indexedDB.open(_config.name, _config.version);
		req.onerror = function(event) {
			$.console.error(event);
		};
		req.onsuccess = function(event) {
			self._db = event.target.result;
			self._load();
		};
		req.onupgradeneeded = function(event) {
			self._db = event.target.result;
			var objStore = self._db.createObjectStore(_config.table, {keyPath: 'key'});
			objStore.add(self._struct);
			self._database = self._struct.data;
			self._loaded = true;
			self._event.emit('load');
		};
	};
	indexedDB.prototype = $.extends(_base, {
		_load: function() {
			var self = this;
			this._db.transaction(_config.table).objectStore(_config.table).get(1).onsuccess = function(event) {
				self._database = (event.target.result).data || {};
				self._loaded = true;
				self._event.emit('load');
			};
		},

		open: function() {
			var p = new $.promise();
			if (this._loaded) {
				return (p.resolve());
			} else {
				this._event.once('load', function() {
					p.resolve();
				});
				return (p);
			}
		},
		save: function() {
			var p = new $.promise(), self = this;
			this.open().then(function() {
				var objectStore = self._db.transaction([_config.table], 'readwrite').objectStore(_config.table);
				self._struct.data = self._database;
				var req = objectStore.put(self._struct);
				req.onerror = function(event) {
					p.reject(event);
				};
				req.onsuccess = function(event) {
					p.resolve(event);
				};
			});
			return (p);
		}
	});
	/* ---------------------- */


	/* ---------- webStorage ------------ */
	var webStorage = function() {
		var self = this;

		this._loaded = false;
		this._event = new $.event();
		this._database = null;
		window.addEventListener('load', function() {
			self._database = JSON.parse(localStorage.getItem(_config.name + ':' + _config.table)) || {};
			self._loaded = true;
			self._event.emit('load');
		});
	};
	webStorage.prototype = $.extends(_base, {
		open: function() {
			var p = new $.promise();
			if (this._loaded) {
				return (p.resolve());
			} else {
				this._event.once('load', function() {
					p.resolve();
				});
				return (p);
			}
		},
		save: function() {
			var self = this;
			return (this.open().then(function() {
				localStorage.setItem(_config.name + ':' + _config.table, JSON.stringfy(self._database));
				return (true);
			}));
		}
	});
	/* ---------------------- */


	/* ---------- webSQL ------------ */
	var webSQL = function() {

	};
	webSQL.prototype = $.extends(_base, {

	});
	/* ---------------------- */


	/* ---------- cookie ------------ */
	var cookie = function() {
		var self = this;

		this._loaded = false;
		this._event = new $.event();
		this._database = null;
		window.addEventListener('load', function() {
			self._database = JSON.parse(_Cookies.getItem(_config.name + ':' + _config.table)) || {};
			self._loaded = true;
			self._event.emit('load');
		});
	};
	cookie.prototype = $.extends(_base, {
		open: function() {
			var p = new $.promise();
			if (this._loaded) {
				return (p.resolve());
			} else {
				this._event.once('load', function() {
					p.resolve();
				});
				return (p);
			}
		},
		save: function() {
			var self = this;
			return (this.open().then(function() {
				_Cookies.setItem(_config.name + ':' + _config.table, JSON.stringfy(self._database), Infinity);
				return (true);
			}));
		}
	});
	/* ---------------------- */

	var list = {
		indexedDB: indexedDB,
		webStorage: webStorage,
		webSQL: webSQL,
		cookie: cookie
	};

	var dbHandle = new list[type]();
	window.addEventListener('beforeunload', function(e) {
		dbHandle.save();
	}, false);
	window.addEventListener('unload', function(e) {
		dbHandle.save();
	}, false);

	$.db = dbHandle;
})(_plApp || (_plApp = {}));