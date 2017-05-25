var date = function(ns) {  
    var d = new Date(ns);  
    var dformat = [ d.getFullYear(), d.getMonth() + 1, d.getDate() ].join('-')   
            + ' ' + [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':');  
    return dformat;  
} 

module.exports = date;