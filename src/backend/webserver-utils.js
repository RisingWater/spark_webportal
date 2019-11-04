var NodeRSA = require('node-rsa');
var KeyMap = new Map();

exports.guid = function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

exports.addKey = function addKey() {
    var key = new NodeRSA({b: 512});
    key.setOptions({encryptionScheme: 'pkcs1'});
    var uuid = exports.guid();
    KeyMap.set(uuid, key);

    setTimeout(function() {
        KeyMap.delete(uuid);
    }, 300000);

    return uuid;
}

exports.getKey = function getKey(uuid) {
    var key = KeyMap.get(uuid);
    return key;
}
