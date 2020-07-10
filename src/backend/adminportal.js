var userdb_controller = require('./db/userdb_controller.js');
var appdb_controller = require('./db/appdb_controller.js');
var desktopdb_controller = require('./db/deskopdb_controller.js')
var utils = require('./webserver-utils.js');

exports.list_user = function list_user(req, res) {
    var alluser = userdb_controller.list_user();
    res.send(alluser);
}

exports.add_user = function add_user(req, res) {
    var userid = utils.guid();
    var user = {
        "userid" : userid,
        "username" : req.body.username,
        "password" : req.body.password,
        "domain" : req.body.domain,
        "appgroup_id" : req.body.appgroup_id,
        "desktopgroup_id" : req.body.desktopgroup_id
    };

    userdb_controller.add_user(user);

    res.sendStatus(200);
}

exports.update_user = function update_user(req, res) {
    var user = {
        "userid" : req.body.userid,
        "username" : req.body.username,
        "password" : req.body.password,
        "domain" : req.body.domain,
        "appgroup_id" : req.body.appgroup_id,
        "desktopgroup_id" : req.body.desktopgroup_id
    };

    console.log(user);

    userdb_controller.update_user(user);

    res.sendStatus(200);
}

exports.del_user = function del_user(req, res) {
    var user = {
        "userid" : req.body.userid,
    };

    userdb_controller.del_user(user);

    res.sendStatus(200);
}

exports.list_appgroup = function list_appgroup(req, res) {
    var allappgroup = appdb_controller.list_appgroup();
    res.send(allappgroup);
}

exports.add_appgroup = function add_appgroup(req, res) {
    var appgroup_id = utils.guid();
    var appgroup = {
        "appgroup_id" : appgroup_id,
        "app_server" : req.body.app_server,
        "vdi_mode" : req.body.vdi_mode,
        "friendly_name" : req.body.friendly_name,
        "delayLogout" : req.body.delayLogout,
        "delayLogoutTime" : req.body.delayLogoutTime,
        "disconnectedPolicy" : req.body.disconnectedPolicy,
        "applist" : new Array()
    };

    appdb_controller.add_appgroup(appgroup);

    res.sendStatus(200);
}

exports.update_appgroup = function update_appgroup(req, res) {
    var appgroup = {
        "appgroup_id" : req.body.appgroup_id,
        "app_server" : req.body.app_server,
        "friendly_name" : req.body.friendly_name,
        "vdi_mode" : req.body.vdi_mode,
        "delayLogout" : req.body.delayLogout,
        "delayLogoutTime" : req.body.delayLogoutTime,
        "disconnectedPolicy" : req.body.disconnectedPolicy,
    };

    appdb_controller.update_appgroup(appgroup);

    res.sendStatus(200);
}

exports.add_app_to_appgroup = function add_app_to_appgroup(req, res) {
    var app_id = utils.guid();
    var appgroup_id = req.params.id;
    var app = {
        "appid" : app_id,
        "appname" : req.body.appname,
        "appicon" : req.body.appicon,
        "mimetype" : req.body.mimetype,
        "apppath" : req.body.apppath,
    }

    console.log(appgroup_id);
    console.log(app);

    appdb_controller.add_app_to_appgroup(appgroup_id, app);

    res.sendStatus(200);
}

exports.list_app = function get_applist(req, res) {
    var appgroup_id = req.params.id;
    var allappgroup = appdb_controller.list_appgroup();
    var applist = [];
    allappgroup.some(element => {
        if (element.appgroup_id == appgroup_id) {
            applist = element.applist;
            return true;
        }
    });

    res.send(applist);
}

exports.del_app_from_appgroup = function del_app_from_appgroup(req, res) {
    var appgroup_id = req.params.id;
    var app = {
        "appid" : req.body.appid,
    }

    console.log(appgroup_id);
    console.log(app);

    appdb_controller.del_app_to_appgroup(appgroup_id, app);

    res.sendStatus(200);    
}

exports.del_appgroup = function del_appgroup(req, res) {
    var appgroup = {
        "appgroup_id" : req.body.appgroup_id,
    };

    appdb_controller.del_appgroup(appgroup);

    res.sendStatus(200);
}

exports.list_desktopgroup = function list_desktopgroup(req, res) {
    var alldesktopgroup = desktopdb_controller.list_desktopgroup()
    res.send(alldesktopgroup);
}

exports.add_desktopgroup = function add_desktopgroup(req, res) {
    var desktopgroup_id = utils.guid();
    var desktopgroup = {
        "desktopgroup_id" : desktopgroup_id,
        "desktopgroup_name" : req.body.desktopgroup_name,
        "desktoplist" : new Array()
    };

    desktopdb_controller.add_desktopgroup(desktopgroup);

    res.sendStatus(200);
}

exports.update_desktopgroup = function update_desktopgroup(req, res) {
    var desktopgroup = {
        "desktopgroup_id" : req.body.desktopgroup_id,
        "desktopgroup_name" : req.body.desktopgroup_name,
    };

    desktopdb_controller.update_desktopgroup(desktopgroup);

    res.sendStatus(200);
}

exports.del_desktopgroup = function del_desktopgroup(req, res) {
    var desktopgroup = {
        "desktopgroup_id" : req.body.desktopgroup_id,
    };

    console.log(desktopgroup);

    desktopdb_controller.del_desktopgroup(desktopgroup);

    res.sendStatus(200);
}

exports.list_desktop = function get_desktoplist(req, res) {
    var desktopgroup_id = req.params.id;
    var alldesktopgroup = desktopdb_controller.list_desktopgroup()
    var desktoplist = [];
    alldesktopgroup.some(element => {
        if (element.desktopgroup_id == desktopgroup_id) {
            desktoplist = element.desktoplist;
            return true;
        }
    });

    res.send(desktoplist);
}

exports.add_desktop_to_desktopgroup = function add_desktop_to_desktopgroup(req, res) {
    var desktop_id = utils.guid();
    var desktopgroup_id = req.params.id;
    var desktop = {
        "desktop_id" : desktop_id,
        "desktop_name" : req.body.desktop_name,
        "vdi_mode" : req.body.vdi_mode,
        "desktop_ip" : req.body.desktop_ip,
    }

    console.log(desktopgroup_id);
    console.log(desktop);

    desktopdb_controller.add_desktop_to_desktopgroup(desktopgroup_id, desktop);

    res.sendStatus(200);
}

exports.del_desktop_from_desktopgroup = function del_desktop_from_desktopgroup(req, res) {
    var desktopgroup_id = req.params.id;
    var desktop = {
        "desktop_id" : req.body.desktop_id,
    }

    console.log(desktopgroup_id);
    console.log(desktop);

    desktopdb_controller.del_desktop_from_desktopgroup(desktopgroup_id, desktop);

    res.sendStatus(200);   
}