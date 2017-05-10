var _plApp;
(function($) {
	"use strict";

	var toGet = function(obj) {
		var str = "";
		for (var key in obj) {
			if (str != "") {
				str += "&";
			}
			str += key + "=" + encodeURIComponent(obj[key]);
		}
		return (str);
	};

	var urlRemote = function(url, https) {
		return ('http://' + url).replace(/(https*:\/\/){2,}/g, (https) ? 'https://' : 'http://');
	};

	$.resolveHttps = function(url) {
		var https = ($.defined(url.match(/https:\/\//)) || location.protocol == 'https:');
		if (https) {
			for (var i in $.app.machine) {
				if (url.match($.app.machine[i].endPoint)) {
					url = urlRemote(('https://' + url).replace($.app.machine[i].endPoint, $.app.machine[i].id + '.sg.product-live.com'), true);
					break;
				}
			}
			url = urlRemote('https://' + url, true);
			return (url);
		}
		return (url);
	};
	
	$.formatUrl = function(url, skip) {
		var https = ($.defined(url.match(/https:\/\//)) || location.protocol == 'https:');
		if (/*$.app.machine && */!url.match('localhost') && url[0] != '/' && skip !== true) {
			/*for (var i in $.app.machine) {
				if (url.match($.app.machine[i].endPoint)) {
					url = urlRemote(('https://' + url).replace($.app.machine[i].endPoint, $.app.machine[i].id + '.sg.product-live.com'), true);
					break;
				}
			}*/
			url = urlRemote('https://' + url, (location.protocol == 'https:'));
		} else {
			if (url[0] != '/') {
				url = urlRemote(url, https);
			}
		}
		return (url);
	};

	$.staticURL = function(url) {
		this._url = url;
	};

	var _fail = {}, _fullSkip = true;
	$.ajax = function(o, fail) {
		var p = new $.promise(), header = o.headers || {};
		var xhr = new XMLHttpRequest();
		var staticURL = (o.url instanceof $.staticURL);
		var url = staticURL? o.url._url : $.formatUrl(o.url, fail);
		var host = url.match(/https:\/\/.*?:*\d*\//);
		if (staticURL) {
			fail = true;
		}

		if (((_fullSkip && location.protocol == 'https:') || (host && _fail[host[0]])) && !staticURL && !fail && !url.match('localhost') && url[0] != '/') {
			return ($.ajax({
				method: 'POST',
				url: $._url.prefix + '/hub/request',
				contentType: 'application/json',
				data: o,
				headers: {
					Authorization: ($.app.login || {}).session
				}
			}, true));
		}

		xhr.open(o.method, url + ((typeof(o.data) === 'object' && o.method == 'GET')? '?' + toGet(o.data) : ''), true);
		for (var i in header) {
			xhr.setRequestHeader(i, header[i]);
		}

		xhr.onreadystatechange = function() {
			if(xhr.readyState === XMLHttpRequest.DONE) {
				var out = xhr.responseText;
				try {
					out = JSON.parse(out);
				} catch(e) {

				}

				if (xhr.status >= 200 && xhr.status <= 300) {
					p.resolve(out)
				} else {
					if (fail || location.protocol != 'https:' || url.match('localhost')) {
						p.reject(out);
					} else {
						if (host) {
							_fail[host[0]] = true;
						}
						$.ajax({
							method: 'POST',
							url: $._url.prefix + '/hub/request',
							contentType: 'application/json',
							data: o,
							headers: {
								Authorization: ($.app.login || {}).session
							}
						}, true).then(function(res) {
							p.resolve(res);
						}, function(e) {
							p.reject(e);
						})
					}
				}
			}
		};

		if (o.timeout) {
			xhr.timeout = o.timeout;
		}

		if (typeof(o.data) === 'object' && o.method != 'GET') {
			xhr.setRequestHeader('Content-Type','application/json');
			xhr.send(JSON.stringify(o.data));
		} else {
			xhr.send(o.data || '');
		}

		return (p);
	};
})(_plApp || (_plApp = {}));