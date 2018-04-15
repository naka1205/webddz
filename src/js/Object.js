



Object.extend = function (destination, source) {
    for (let property in source)
        destination[property] = source[property];
    return destination;
};

Object.extend(Object, {
    keys: function (object) {
        let keys = [];
        for (let property in object)
            keys.push(property);
        return keys;
    },
    isFunction: function (object) {
        return typeof object == "function";
    },
    isUndefined: function (object) {
        return typeof object == "undefined";
    }
});
Object.extend(Function.prototype, {
    argumentNames: function () {
        let names = this.toString().match(/^[\s\(]*function[^(]*\(([^\)]*)\)/)[1].replace(/\s+/g, '').split(',');
        return names.length == 1 && !names[0] ? [] : names;
    },
    bind: function () {
        if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
        let __method = this, args = $A(arguments), object = args.shift();
        return function () {
            return __method.apply(object, args.concat($A(arguments)));
        }
    },
    wrap: function (wrapper) {
        let __method = this;
        return function () {
            return wrapper.apply(this, [__method.bind(this)].concat($A(arguments)));
        }
    }
});
Object.extend(Array.prototype, {
    first: function () {
        return this[0];
    }
});


module.exports = Object;
// window.Object = Object;