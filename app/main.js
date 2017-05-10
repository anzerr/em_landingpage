var _plApp;
(function($) {
    "use strict";

    window.addEventListener('load', function() {
        $.require([
            'app/lib/jquery.js',
            'app/react-15.0.2/react.js',
            'app/react-15.0.2/react-dom.js',

            'app/lib/namespace.js',

            'app/lib/extends.js',
            'app/lib/events.js',
            'app/lib/merge.js',
            'app/lib/localdb.js',
            'app/lib/page/page.js',
            'app/lib/page/route.js',
            'app/lib/format.js',
            'app/lib/seed.js',
            'app/lib/ajax.js',
            'app/lib/json.js',
            'app/lib/deus.js',

            'app/module/home.js'
        ]).then(function() {
            $.route.add({
                path: '/',
                action: {
                    controller: 'home',
                    method: 'index'
                }
            });

            window.addEventListener('hashchange', function(res) {
                $.route.run(res.newURL);
            });
            $.route.run(window.location.href).then(function() {
                setTimeout(function() {
                    document.getElementById('block').style.opacity = 0;
                    document.getElementById('block').style['pointer-events'] = 'none';
                    document.getElementById('block').childNodes[1].style.height = '0%';
                }, 200);
            });

        })
    });

})(_plApp || (_plApp = {}));