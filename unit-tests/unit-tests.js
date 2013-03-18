/*global $: false, test: false, ok: false, module: false, strictEqual: false, asyncTest: false, start: false, PRIS: false */
/*jslint browser: true, sloppy: true, forin: true, plusplus: true, maxerr: 50, indent: 4 */

$(document).ready(function () {

    test('Namespace', function () {
        ok(typeof PRIS === 'object', 'PRIS is an Object.');
    });

    test('API', function () {
        ok(typeof PRIS.set === 'function', 'set() exists');
        ok(typeof PRIS.get === 'function', 'get() exists');
        ok(typeof PRIS.remove === 'function', 'remove() exists');
        ok(typeof PRIS.bind === 'function', 'bind() exists');
        ok(typeof PRIS.unbindAll === 'function', 'unbindAll() exists');
        ok(typeof PRIS.empty === 'function', 'empty() exists');
    });

    module('crud', {
        setup: function () {
            PRIS.empty();
        }
    });

    test('Setting value', function () {
        PRIS.set('bad', 'dudes');
        strictEqual(window.location.hash, '#/bad/dudes/', 'Location hash is as expected.');
    });

    test('Getting value', function () {
        PRIS.set('bad', 'dudes');
        strictEqual(PRIS.get('bad'), 'dudes', 'Returned value is correct.');
    });

    test('Changing value', function () {
        PRIS.set('bad', 'guys');
        strictEqual(window.location.hash, '#/bad/guys/', 'Location hash is as expected.');
        strictEqual(PRIS.get('bad'), 'guys', 'Returned value is correct.');

        PRIS.set('bad', 'dudes');
        strictEqual(window.location.hash, '#/bad/dudes/', 'Changed location hash is as expected.');
        strictEqual(PRIS.get('bad'), 'dudes', 'Changed value is correct.');
    });

    test('Removing value', function () {
        PRIS.set('bad', 'guys');
        strictEqual(window.location.hash, '#/bad/guys/', 'Location hash is as expected.');
        strictEqual(PRIS.get('bad'), 'guys', 'Returned value is correct.');

        PRIS.remove('bad');
        strictEqual(window.location.hash, '#/', 'URL hash is correct.');
        ok(typeof PRIS.get('bad') === 'undefined', 'Removed value is undefined.');
    });

    test('Numerical value stored as Number', function () {
        PRIS.set('number', 23);
        strictEqual(typeof PRIS.get('number'), 'number');

        window.location.hash = '#/number/500/';
        PRIS.serializeHash();
        strictEqual(typeof PRIS.get('number'), 'number');
    });

    test('Boolean value stored as Boolean', function () {
        PRIS.set('boolean', true);
        strictEqual(typeof PRIS.get('boolean'), 'boolean');

        window.location.hash = '#/boolean/true/';
        PRIS.serializeHash();
        strictEqual(typeof PRIS.get('boolean'), 'boolean');
    });

    module('callbacks', {
        setup: function () {
            PRIS.empty();
            PRIS.unbindAll();
        }
    });

    asyncTest('Single callback', function () {
        setTimeout(function () {
            PRIS.bind(function () {
                ok(true, 'Callback fired.');
                start();
            });

            PRIS.set('cool', 'runnings');
        }, 1000);
    });

    asyncTest('Multiple callbacks', function () {
        setTimeout(function () {
            PRIS.bind(function () {
                ok(true, 'Callback 1 fired.');
                start();
            });

            PRIS.bind(function () {
                ok(true, 'Callback 2 fired.');
                start();
            });

            PRIS.set('cool', 'runnings');
        }, 2000);
    });

});
