var utils = require('./webserver-utils');
var json_template = require('./respone_template');
var userdb_controller = require('./userdb_controller');
var appdb_controller = require('./appdb_controller');
var desktopdb_controller = require('./deskopdb_controller');

function decrypt(uuid, encryption) {
    var encryption_new = encryption.replace(/\ /g, '+');
    var key = utils.getKey(uuid);
    var userjson = key.decrypt(encryption_new,"utf8");

    userjson = JSON.stringify(eval('(' + userjson + ')'));
    var user = JSON.parse(userjson);

    return user;
}

exports.getPublicKey = function (req, res) {
    var uuid = utils.addKey();
    var key = utils.getKey(uuid);
    var publicDer = key.exportKey('public');
    publicDer += "\nuuid=" + uuid;

    res.set("Content-disposition", "attachment;filename=publicKey.key");
    res.send(publicDer);
}

exports.autologin = function (req, res) {
    var uuid = req.query.uuid;
    var encryption = req.query.encryption;
    var userjson = decrypt(uuid, encryption);

    var user = userdb_controller.finduser_byusername(userjson.username, userjson.password);

    if (user == null) {
        res.sendStatus(501);
        return;
    } 
    
    var user_id = { "userid" : user.userid };
    res.send(user_id);    
}

exports.appGetToken = function (req, res) {
    var uuid = req.query.uuid;
    var encryption = req.query.encryption;
    var userjson = decrypt(uuid, encryption);

    var user = userdb_controller.finduser_byusername(userjson.username, userjson.password);

    if (user == null) {
        res.sendStatus(501);
        return;
    }

    res.send(json_template.fill_usertoken(user.userid, user.username, user.domain));
}

exports.updateToken = function (req, res) {
    var token_id = req.params.token;

    var user = userdb_controller.finduser_byuserid(token_id);

    if (user == null) {
        res.sendStatus(501);
        return;
    }
    
    res.send(json_template.fill_usertoken(user.userid, user.username, user.domain));
}

exports.getAppList = function (req, res) {
    var token_id = req.params.token;

    var user = userdb_controller.finduser_byuserid(token_id);
    
    if (user == null) {
        res.sendStatus(501);
        return;
    }

    var app_group = appdb_controller.find_appgroup_byid(user.appgroup_id);

    if (app_group == null)
    {
        res.sendStatus(502);
        return;
    }

    var applist = new Array();
    
    appdb_controller.traversal_appgroup(app_group, function (app) {
        applist.push(json_template.fill_appInfo(app.appid, app.appicon, app.appname));
    })
    
    res.send(applist);
}

exports.getAppConnectionFile = function (req, res) {
    var token_id = req.params.token;
    var app_id = req.params.appid;
   
    var user = userdb_controller.finduser_byuserid(token_id);
    
    if (user == null) {
        res.sendStatus(501);
        return;
    }

    var app_group = appdb_controller.find_appgroup_byid(user.appgroup_id);

    if (app_group == null)
    {
        res.sendStatus(502);
        return;
    }

    var app = appdb_controller.find_app_byid(app_group, app_id);
    if (app == null)
    {
        res.sendStatus(503);
        return;
    }

    var IniString = "[default]\n" +
        "title=" + app.appname + "\n" +
        "username=" + user.username + "\n" +
        "userpass=" + user.password + "\n" +
        "userdomain=" + user.domain + "\n" + 
        "vdi=" + app_group.vdi_mode + "\n" + 
        "remoteapp=" + app.apppath +"\n" + 
        "background=0\n" +
        "drag=0\n" + 
        "protocol=Xred\n" +
        "delayLogout=" + app_group.delayLogout + "\n" +
        "delayLogoutTime=" + app_group.delayLogoutTime + "\n" + 
        "disconnectedPolicy=" + app_group.disconnectedPolicy + "\n" + 
        "ip=" + app_group.app_server + "\n" +
        "desktopId=" + app_group.app_server + "\n";

    res.set("Content-type", "application/x-ivy")
    res.set("Content-disposition", "attachment;filename=" + app.appid + ".ivy");
    res.send(IniString);
}

exports.getDesktopList = function (req, res) {
    var token_id = req.params.token;

    var user = userdb_controller.finduser_byuserid(token_id);
    
    if (user == null) {
        res.sendStatus(501);
        return;
    }

    var desktop_group = desktopdb_controller.find_desktopgroup_byid(user.desktopgroup_id);

    if (desktop_group == null)
    {
        res.sendStatus(502);
        return;
    }
    
    res.send(desktop_group);
}

exports.getDesktopConnectionFile = function (req, res) {
    var token_id = req.params.sid;
    var desktop_id = req.params.desktop_id;
   
    var user = userdb_controller.finduser_byuserid(token_id);
    
    if (user == null) {
        res.sendStatus(501);
        return;
    }

    var desktop_group = desktopdb_controller.find_desktopgroup_byid(user.desktopgroup_id);

    if (desktop_group == null)
    {
        res.sendStatus(502);
        return;
    }

    var desktop = desktopdb_controller.find_desktop_byid(desktop_group, desktop_id);
    if (desktop == null)
    {
        res.sendStatus(503);
        return;
    }

    var IniString = "[default]\n" +
        "title=" + desktop.desktop_name + "\n" +
        "username=" + user.username + "\n" +
        "userpass=" + user.password + "\n" +
        "userdomain=" + user.domain + "\n" + 
        "vdi=" + desktop.vdi_mode + "\n" + 
        "protocol=Xred\n" +
        "ip=" + desktop.desktop_ip + "\n" +
        "desktopId=" + desktop.desktop_ip + "\n";

    res.set("Content-type", "application/x-ivy")
    res.set("Content-disposition", "attachment;filename=" + app.appid + ".ivy");
    res.send(IniString);
}

exports.login = function (req, res) {
    var postdata = req.body;

    var user = userdb_controller.finduser_byusername(postdata.username, postdata.password);

    if (user == null) {
        res.sendStatus(501);
        return;
    } 
    
    var user_id = { "userid" : user.userid };
    res.send(user_id);   
}

exports.indexRedirection = function (req, res) {
    res.redirect("Login.html");
}