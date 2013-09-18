(function () {
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
    };

    function Collection(args) {
        // Accept different types
        args = this._toArray(args) || [];
        pApply(args, 'push', this);
    }


    Collection.prototype = {
        get size() {
            return this.length;
        },

        get json() {
            return JSON.stringify(this);
        },

        get repr() {
            var self = this;
            // override toJSON for repr purposes
            Object.defineProperty(this, 'toJSON', { value: null, writeable: true, configurable: true });

            var repr = JSON.stringify(this, function (key, val) {
                if (self === val || !isNaN(parseInt(key, 10))) {
                    return val;
                }
                return void 0;
            });

            // reset
            delete this.toJSON;
            return repr;
        }
    };

    Object.defineProperties(Collection.prototype, {
        // Track length of collections
        length: {
            value: 0,
            writable: true,
            enumerable: true
        },

        _toArray: {
            value: function (args) {
                if (args && !Array.isArray(args) && arguments.length >= 0) {
                    // Convert to array
                    if (typeof args.toArray === 'function') {
                        args = args.toArray();
                        if (!Array.isArray(args)) throw new Error('toArray did not return an array');
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
                if (!this._events) {
                    Object.defineProperty(this, '_events', {
                        value: {}
                    });
                }
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
                        if (ev.fn.length) {
                            ev.fn.apply(ev.ctx, args);
                        }
                    });
                }
                return this;
            }
        },

        toJSON: {
            value: function () {
                return this.map(function (val) {
                    return val;
                });
            }
        }
    });

    var omit = ['length', 'constructor', 'toString', 'toLocalString'];
    Object.getOwnPropertyNames(arrProto).forEach(function (fn) {
        if (omit.indexOf(fn) > -1) return;
        
        Object.defineProperty(Collection.prototype, fn, {
            value: function () {
                var args = __slice.call(arguments);
                var ret = arrProto[fn].apply(this, args);
                var evArgs = [fn, ret];
                pApply(evArgs, 'trigger', this);
                return ret;
            }
        });
    });


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Collection;
    } else {
        // Just incase another type of collection
        // exists on the window already
        var oldC = window.Collection;
        window.Collection = Collection;
    }

    Object.defineProperties(Collection, {
        zip: {
            value: function () {
                var args = __slice.call(arguments);
                var lengths = args.map(function (c) { return c.length; });
                var length = pApply(lengths, 'max', Math);
                var results = new Array(length);
                var map = function (c) { return c[i]; };
                for (var i = 0; i < length; i += 1) {
                    results[i] = args.map(map);
                }
                return results;
            }
        },
        noConflict: {
            value: function () {
                if (!(typeof module !== 'undefined' && typeof module.exports !== 'undefined'))
                    throw new Error('Environment is not browser!');
                window.Collection = oldC;
                return Collection;
            }
        }
    });
})();
