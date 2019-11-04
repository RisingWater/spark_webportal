var db = require('./db.js');

exports.find_appgroup_byid = function find_appgroup_byid(appgroup_id) {
    var appgroup = null;
    db.load_appgroup_db().some(element => {
        if (element.appgroup_id == appgroup_id)
        {
            appgroup = element;
            return true;
        }
    })

    return appgroup;
}

exports.find_app_byid = function find_app_byid(appgroup, app_id) {
    var app = null;
    appgroup.applist.forEach(element => {
        if (element.appid == app_id)
        {
            app = element;
            return true;
        }
    });

    return app;
}

exports.traversal_appgroup = function traversal_appgroup(appgroup, callback) {
    appgroup.applist.forEach(element => {
        if (typeof callback == "function") {
            callback(element);
        }
    })
}

exports.list_appgroup = function () {
    return db.load_appgroup_db();
}

exports.add_appgroup = function (appgroup) {
    var appgroups = db.load_appgroup_db();
    appgroups.push(appgroup);
    db.save_appgroup_db(appgroups);
}

exports.update_appgroup = function (appgroup) {
    var appgroups = db.load_appgroup_db();
    appgroups.some(element => {
        if (element.appgroup_id == appgroup.appgroup_id) {
            element.app_server = appgroup.app_server;
            element.vdi_mode = appgroup.vdi_mode;
            element.friendly_name = appgroup.friendly_name;
            element.delayLogout = appgroup.delayLogout;
            element.delayLogoutTime = appgroup.delayLogoutTime;
            element.disconnectedPolicy = appgroup.disconnectedPolicy;
            return true;
        }
    });
    db.save_appgroup_db(appgroups);
}

exports.add_app_to_appgroup = function (appgroup_id, app) {
    var appgroups = db.load_appgroup_db();
    appgroups.some(element => {
        if (element.appgroup_id == appgroup_id) {
            element.applist.push(app);
            console.log(element);
            return true;
        }
    });

    db.save_appgroup_db(appgroups);
}

exports.del_app_to_appgroup = function (appgroup_id, app) {
    var appgroups = db.load_appgroup_db();
    appgroups.some(element => {
        if (element.appgroup_id == appgroup_id) {
            element.applist = element.applist.filter(appelement => {
                return appelement.appid != app.appid;
            })

            console.log(element);
            return true;
        }
    });

    db.save_appgroup_db(appgroups);
}

exports.del_appgroup = function (appgroup) {
    var appgroups = db.load_appgroup_db();
    appgroups = appgroups.filter(element => {
        return element.appgroup_id != appgroup.appgroup_id;
    });
    db.save_appgroup_db(appgroups);
}