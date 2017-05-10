var _plApp;
(function($) {
    "use strict";

    var load = function(src) {
        var p = new $.promise(), script = document.createElement('script');
        script.src = src;
        script.onload = function() {
            p.resolve();
        };
        document.head.appendChild(script);
        return (p);
    };

    $.require = function(a) {
        var wait = [], list = ($.is.array(a)) ? a : [a];

        var run = function(i) {
            if (!$.defined(list[i])) {
                return ($.promise().resolve());
            }
            return (load(list[i]).then(function() {
                return (run(i + 1));
            }))
        };
        return (run(0));
    };

})(_plApp || (_plApp = {}));