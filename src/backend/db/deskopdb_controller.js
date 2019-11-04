var db = require('./db.js');

exports.find_desktopgroup_byid = function find_desktopgroup_byid(desktopgroup_id) {
    var desktopgroup = null;
    db.load_desktopgroup_db().some(element => {
        if (element.desktopgroup_id == desktopgroup_id)
        {
            desktopgroup = element;
            return true;
        }
    })

    return desktopgroup;
}

exports.find_desktop_byid = function find_desktop_byid(desktopgroup, desktop_id) {
    var desktop = null;
    desktopgroup.desktoplist.forEach(element => {
        if (element.desktop_id == desktop_id)
        {
            desktop = element;
            return true;
        }
    });

    return desktop;
}

exports.traversal_desktopgroup = function traversal_desktopgroup(desktopgroup, callback) {
    desktopgroup.desktoplist.forEach(element => {
        if (typeof callback == "function") {
            callback(element);
        }
    })
}

exports.list_desktopgroup = function () {
    return db.load_desktopgroup_db();
}

exports.add_desktopgroup = function (dekstopgroup) {
    var desktopgroups = db.load_desktopgroup_db();
    desktopgroups.push(dekstopgroup);
    db.save_desktopgroup_db(desktopgroups);
}

exports.update_desktopgroup = function (dekstopgroup) {
    var desktopgroups = db.load_desktopgroup_db();
    desktopgroups.some(element => {
        if (element.desktopgroup_id == dekstopgroup.desktop_id) {
            element.desktopgroup_name = dekstopgroup.desktopgroup_name;
            return true;
        }
    });
    db.save_desktopgroup_db(desktopgroups);
}

exports.add_desktop_to_desktopgroup = function (desktopgroup_id, desktop) {
    var desktopgroups = db.load_desktopgroup_db();
    desktopgroups.some(element => {
        if (element.desktopgroup_id == desktopgroup_id) {
            element.desktoplist.push(desktop);
            console.log(element);
            return true;
        }
    });

    db.save_desktopgroup_db(desktopgroups);
}

exports.del_desktop_from_desktopgroup = function (desktopgroup_id, desktop) {
    var desktopgroups = db.load_desktopgroup_db();
    desktopgroups.some(element => {
        if (element.desktopgroup_id == desktopgroup_id) {
            element.desktoplist = element.desktoplist.filter(desktopelement => {
                return desktopelement.desktop_id != desktop.desktop_id;
            })

            console.log(element);
            return true;
        }
    });

    db.save_desktopgroup_db(desktopgroups);
}

exports.del_desktopgroup = function (desktopgroup) {
    var desktopgroups = db.load_desktopgroup_db();
    desktopgroups = desktopgroups.filter(element => {
        return element.desktopgroup_id != desktopgroup.desktopgroup_id;
    });
    db.save_desktopgroup_db(desktopgroups);
}