// Resources.js

(function () {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    // Publicly accessible image loading function
    function load(urlOrArr) {
        if (urlOrArr instanceof Array) {
            // Loops through each value and call our image loader on that image file
            urlOrArr.forEach(function (url) {
                _load(url);
            });
        } else {
            // Assumes the value is a string and call our image loader directly
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if (resourceCache[url]) {
            return resourceCache[url];
        } else {
            var img = new Image();
            img.onload = function () {
                resourceCache[url] = img;

                if (isReady()) {
                    readyCallbacks.forEach(function (func) {
                        func();
                    });
                }
            };

            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developers to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }


    /* This function determines if all of the images that have been requested
     * for loading have in fact been properly loaded.
     */
    function isReady() {
        var ready = true;
        for (var k in resourceCache) {
            if (resourceCache.hasOwnProperty(k) &&
                !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    // Adds a function to the callback stack that is called when all requested images are properly loaded
    function onReady(func) {
        readyCallbacks.push(func);
    }

    // Defines the publicly accessible functions available to developers by creating a global Resources object
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
