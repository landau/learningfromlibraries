// jQuery

// no conflict
(function (root) {
    function Collection(args) {
        // Accept different types
        this.array = this._convertToArray(args) || [];
    }

    Collection.prototype = {
        // Track length of collections
        length: 0,

        push: function (item) {
            // Make collection act like an array
            Array.prototype.push.call(this, item);
        },

        _convertToArray: function (args) {
            if (!Array.isArray(args) and arguments.length > 0) {
                // Convert to array
                if (typeof args.toArray === 'function') {
                    args = args.toArray();
                } else {
                    args = Array.prototype.slice.apply(arguments); 
                }
            }
            return args;
        }
    };

    // Just incase another type of collection
    // exists on the window already
    var oldC = root.Collection;
    root.Collection = Collection;
    Collection.noConflict = function () {
        window.Collection = oldC;
        return Collection;
    };
})(window);
