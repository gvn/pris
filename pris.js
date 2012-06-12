/*global PRIS: true */
/*jslint browser: true, sloppy: true, forin: true, plusplus: true, maxerr: 50, indent: 4 */

/*
 * Pris 0.3.0
 *
 * Copyright 2012, Gvn Suntop
 *
 */

if (typeof window.PRIS !== 'undefined') {
    throw 'Global variable "PRIS" already in use.';
}

window.PRIS = (function () {

    var database = {},
        callbacks = [],
        events,
        lastHash = window.location.hash;

    function setHash() {
        var uri = '/',
            key;

        for (key in database) {
            uri += (key + '/' + database[key] + '/');
        }

        location.hash = uri;
    }

    function serializeHash() {
        if (location.hash.length) {
            var fragments = window.location.hash,
                i,
                ii;

            // Remove trailing slash if there is one
            if (fragments[fragments.length - 1] === '/') {
                fragments = fragments.slice(0, -1);
            }

            fragments = fragments.split('/');

            // Remove hash character
            fragments = fragments.slice(1);

            // Wipe database
            database = {};

            // Build out the database object with keys and values from URL.
            for (i = 0, ii = fragments.length; i < ii; i += 2) {
                // Make strings containing numbers into actual numbers
                if (isNaN(parseInt(fragments[i + 1], 10))) {
                    database[fragments[i]] = fragments[i + 1];
                } else {
                    database[fragments[i]] = parseInt(fragments[i + 1], 10);
                }
            }
        }

        events.databaseUpdated();
    }

    function set(key, value) {
        database[key] = value;
        setHash();
    }

    function get(key) {
        return database[key];
    }

    function remove(key) {
        delete database[key];
        setHash();
    }

    function bind(callback, scope) {
        callbacks.push({
            callback: callback,
            scope: scope
        });
    }

    function unbindAll() {
        callbacks = [];
    }

    function runCallbacks() {
        var i,
            ii;

        if (callbacks.length) {
            for (i = 0, ii = callbacks.length; i < ii; i++) {
                callbacks[i].callback.call(callbacks[i].scope, database);
            }
        }
    }

    function empty() {
        location.hash = '';
        database = {};
    }

    events = {
        databaseUpdated: function () {
            runCallbacks();
        }
    };

    serializeHash();

    if (typeof window.onhashchange === 'object' && typeof window.addEventListener === 'function') {
        window.addEventListener('hashchange', function () {
            serializeHash();
        });
    } else {
        // Compensate for lack of native hashchange event
        setInterval(function () {
            if (lastHash !== window.location.hash) {
                serializeHash();
            }

            lastHash = window.location.hash;
        }, 100);
    }

    return {
        set: set,
        get: get,
        remove: remove,
        bind: bind,
        unbindAll: unbindAll,
        empty: empty
    };

}());