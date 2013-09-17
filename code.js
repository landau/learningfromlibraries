(function (root) {
    'use strict';

    var arrProto = Array.prototype;
    var __slice = arrProto.slice;

    function Collection(args) {
        // Accept different types
        args = this._convertToArray(args) || [];
        this.push.apply(this, args);
    }

    Collection.prototype = {
        // Track length of collections
        length: 0,

        _convertToArray: function (args) {
            if (!Array.isArray(args) && arguments.length > 0) {
                // Convert to array
                if (typeof args.toArray === 'function') {
                    args = args.toArray();
                } else {
                    args = __slice.apply(arguments); 
                }
            }
            return args;
        },

        on: function (name, fn, ctx) {
            // Event hash to holf events
            this._events = this._events || {};
            var events = this._events[name] || (this._events[name] = []);
            events.push({ fn: fn, ctx: ctx || this });
            return this;
        },

        trigger: function (name) {
            if (!this._events) return this;
            var args = __slice.call(arguments, 1);
            var events = this._events[name];
            if (events) {
                events.forEach(function (ev) {
                    ev.fn.apply(ev.ctx, args);
                });
            }
            return this;
        }
    };

    var omit = ['length', 'constructor', 'toString', 'toLocalString'];
    var methods = Object.getOwnPropertyNames(arrProto)
        .filter(function (fn) {
            return omit.indexOf(fn) < 0;
        });

    methods.forEach(function (fn) {
        Collection.prototype[fn] = function () {
            var args = __slice.call(arguments);
            var ret = arrProto[fn].apply(this, args);
            args = [fn].concat(args);
            this.trigger.apply(this, args);
            return ret;
        };
    });


    Collection.zip = function () {
        var args = __slice.call(arguments);
        var lengths = args.map(function (c) { return c.length; });
        var length = Math.max(lengths.concat(0));
        var results = new Array(length);
        for (var i = 0; i < length; i += 1) {
            results[i] = args.map(function (c) { return c[i]; });
        }
        return results;
    };

    // Just incase another type of collection
    // exists on the window already
    var oldC = root.Collection;
    root.Collection = Collection;
    Collection.noConflict = function () {
        root.Collection = oldC;
        return Collection;
    };
})(window);

var log = console.log;
var Collection = Collection.noConflict();

var c = new Collection([1,2,3]);
log(c, c.length === 3);

c.on('push', function () {
    log('push event', arguments);
});
c.push(4, 5, 6);
log(c, c.length === 6);

