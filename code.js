var window = {};
(function (root) {
    'use strict';

    var arrProto = Array.prototype;
    var __slice = arrProto.slice;

    // performant apply
    // Performance optimization: http://jsperf.com/apply-vs-call-vs-invoke
    var pApply = function (args, fn, ctx) {
        switch (args.length) {
            case 0: return ctx[fn]();
            case 1: return ctx[fn](args[0]);
            case 2: return ctx[fn](args[0], args[1]);
            case 3: return ctx[fn](args[0], args[1], args[2]);
            case 4: return ctx[fn](args[0], args[1], args[2], args[3]);
            case 5: return ctx[fn](args[0], args[1], args[2], args[3], args[4]);
            case 6: return ctx[fn](args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7: return ctx[fn](args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
            case 8: return ctx[fn](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
            case 9: return ctx[fn](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
            case 10: return ctx[fn](args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
            default: return ctx[fn].apply(ctx, args);
        }
    }

    function Collection(args) {
        // Accept different types
        args = this._convertToArray(args) || [];
        pApply(args, 'push', this);
    }

    Collection.prototype = {
        get size() {
            return this.length;
        }
    };

    Object.defineProperties(Collection.prototype, {
        // Track length of collections
        length: {
            value: 0,
            enumerable: true,
            configurable: true
        },

        _convertToArray: {
            value: function (args) {
                if (!Array.isArray(args) && arguments.length > 0) {
                    // Convert to array
                    if (typeof args.toArray === 'function') {
                        args = args.toArray();
                    } else {
                        args = __slice.apply(arguments); 
                    }
                }
                return args;
            }
        },

        on: {
            value: function (name, fn, ctx) {
                // Event hash to holf events
                this._events = this._events || {};
                var events = this._events[name] || (this._events[name] = []);
                events.push({ fn: fn, ctx: ctx || this });
                return this;
            }
        },

        trigger: {
            value: function (name) {
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
        }
    });

    var omit = ['length', 'constructor', 'toString', 'toLocalString'];
    var methods = Object.getOwnPropertyNames(arrProto)
        .filter(function (fn) {
            return omit.indexOf(fn) < 0;
        });

    methods.forEach(function (fn) {
        Object.defineProperty(Collection.prototype, fn, {
            value: function () {
                var args = __slice.call(arguments);
                var ret = arrProto[fn].apply(this, args);
                args = [fn].concat(args);
                pApply(args, 'trigger', this);
                return ret;
            }
        });
    });


    // Just incase another type of collection
    // exists on the window already
    var oldC = root.Collection;
    root.Collection = Collection;

    Object.defineProperties(Collection, {
        zip: {
            value: function () {
                var args = __slice.call(arguments);
                var lengths = args.map(function (c) { return c.length; });
                var length = Math.max(lengths.concat(0));
                var results = new Array(length);
                for (var i = 0; i < length; i += 1) {
                    results[i] = args.map(function (c) { return c[i]; });
                }
                return results;
            }
        },
        noConflict: {
            value: function () {
                root.Collection = oldC;
                return Collection;
            }
        }
    });
})(window);

(function (root) {
    'use strict';
    var log = console.log;
    var Collection = root.Collection.noConflict();

    var c = new Collection([1,2,3]);
    log(c, c.length === 3);

    c.on('push', function () {
        log('push event', arguments);
    });
    c.push(4, 5, 6);
    log(c, c.length === 6);

    try {
        Collection.zip = 'foo';
    } catch (e) {
        log(e.message);
    }

    console.log(c.size === c.length); // true
    console.log(Collection.prototype); // { size: [Getter], length: 0 }
    console.log(Collection.prototype.trigger); // [Function]

})(window);
