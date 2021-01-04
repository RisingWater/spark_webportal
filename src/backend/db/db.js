var path = require('path');
var fs = require('fs');

function load_db(filename) {
    var file = path.join(__dirname, filename);
    var data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return data;
}

function save_db(filename, data) {
    var file = path.join(__dirname, filename);
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

exports.load_server_config = function load_server_config() {
    return load_db('../../../db/server_config.json');
}

exports.load_user_db = function load_user_db() {
    return load_db('../../../db/user_db.json');
}

exports.load_appgroup_db = function load_appgroup_db() {
    return load_db('../../../db/appgroup_db.json');
}

exports.load_desktopgroup_db = function load_desktopgroup_db() {
    return load_db('../../../db/desktopgroup_db.json');
}

exports.load_upgrade_db = function load_upgrade_db() {
    return load_db('../../../db/upgrade.json');
}

exports.save_server_config = function save_server_config(data) {
    return save_db('../../../db/server_config.json', data);
}

exports.save_user_db = function save_user_db(data) {
    return save_db('../../../db/user_db.json', data);
}

exports.save_appgroup_db = function save_appgroup_db(data) {
    return save_db('../../../db/appgroup_db.json', data);
}

exports.save_desktopgroup_db = function save_desktopgroup_db(data) {
    return save_db('../../../db/desktopgroup_db.json', data);
}
   
    