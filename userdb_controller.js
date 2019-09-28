var db = require('./db');

exports.list_user = function () {
    return db.load_user_db();
}

exports.add_user = function (user) {
    var users = db.load_user_db();
    users.push(user);
    db.save_user_db(users);
}

exports.update_user = function (user) {
    var users = db.load_user_db();
    users.some(element => {
        if (element.userid == user.userid) {
            element.username = user.username;
            element.password = user.password;
            element.domain = user.domain;
            element.appgroup_id = user.appgroup_id;
            element.desktopgrou_id = user.desktopgrou_id;
            return true;
        }
    });
    db.save_user_db(users);
}

exports.del_user = function (user) {
    var users = db.load_user_db();
    users = users.filter(element => {
        return element.userid != user.userid;
    });
    db.save_user_db(users);
}

exports.finduser_byusername = function (username, password) {
    var user = null;
    db.load_user_db().some(element => {
        if (element.username == username
            && element.password == password) {
                user = element;
                return true;
            }
    });

    return user;
}

exports.finduser_byuserid = function (userid) {
    var user = null;
    db.load_user_db().some(element => {
        if (element.userid == userid) {
            user = element;
            return true;
        }
    });

    return user;
}

