/*
 * Pris 0.1
 *
 * Copyright 2012, Gvn Suntop
 *
 */

if (typeof window.PRIS !== 'undefined') {
    throw 'Global variable "PRIS" already in use.';
}

window.PRIS = (function () {

    var database = {},
        callbacks = [];

    var events = {
        databaseUpdated: function () {
            runCallbacks();
        }
    }

    function setHash() {
        console.log('setHash');

        var uri = '/',
            key;

        for (key in database) {
            uri += (key + '/' + database[key] + '/');
        }

        location.hash = uri;
    }

    function serializeHash() {
        console.log('serializeHash');

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
                if (isNaN(parseInt(fragments[i + 1]))) {
                    database[fragments[i]] = fragments[i + 1];  
                } else {
                    database[fragments[i]] = parseInt(fragments[i + 1]);    
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

    function bind (callback, scope) {
        callbacks.push({
            callback: callback,
            scope: scope
        });
    }

    function unbindAll () {
        callbacks = [];
    }

    function runCallbacks () {
        var i,
            ii;

        if (callbacks.length) {
            for (i = 0, ii = callbacks.length; i < ii; i++) {
                callbacks[i].callback.call(callbacks[i].scope, database);
            }   
        }
    }

    serializeHash();

    addEventListener('hashchange', function () {
        serializeHash();
    });

    return {
        set: set,
        get: get,
        remove: remove,
        bind: bind,
        unbindAll: unbindAll
    };

}());