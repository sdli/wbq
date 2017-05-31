"use strict";

var date = function date(ns) {
    var d = new Date(ns);
    console.log(d);
    var dformat = [d.getFullYear(), d.getMonth() < 9 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1, d.getDate() < 9 ? "0" + d.getDate() : d.getDate()].join('-') + ' ' + [d.getHours() < 10 ? "0" + d.getHours() : d.getHours(), d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(), d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()].join(':');
    return dformat;
};

module.exports = date;
//# sourceMappingURL=date.js.map