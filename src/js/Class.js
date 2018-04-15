
window.$A = function (iterable) {
    if (!iterable) return [];
    if (iterable.toArray) return iterable.toArray();
    let length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
}

var Class = {};

Class = {
    create: function () {
        let parent = null, properties = $A(arguments);
        if (Object.isFunction(properties[0]))
            parent = properties.shift();
        function klass() {
            this.initialize.apply(this, arguments);
        }
        Object.extend(klass, Class.Methods);
        klass.superclass = parent;
        klass.subclasses = [];
        if (parent) {
            let subclass = function () { };
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }
        for (let i = 0; i < properties.length; i++)
            klass.addMethods(properties[i]);

        if (!klass.prototype.initialize)
            klass.prototype.initialize = Prototype.emptyFunction;
        klass.prototype.constructor = klass;
        return klass;
    }
};
Class.Methods = {
    addMethods: function (source) {
        let ancestor = this.superclass && this.superclass.prototype;
        let properties = Object.keys(source);
        if (!Object.keys({ toString: true }).length)
            properties.push("toString", "valueOf");
        for (let i = 0, length = properties.length; i < length; i++) {
            let property = properties[i], value = source[property];
            if (ancestor && Object.isFunction(value) && value.argumentNames().first() == "$super") {
                let method = value;
                value = (function (m) {
                    return function () { return ancestor[m].apply(this, arguments) };
                })(property).wrap(method);
                value.valueOf = method.valueOf.bind(method);
                value.toString = method.toString.bind(method);
            }
            this.prototype[property] = value;
        }
        return this;
    }
};

module.exports = Class;
// window.Class = Class;