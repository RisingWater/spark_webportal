var usertoken_template = {
    "token" : "",
    "tokeninfo" : {
        "expires_at": "",
        "issued_at": "",
        "methods": [
            "password"
        ],
        "user": {
            "domain": "",
            "id": "",
            "name": "",
            "usnid": ""
        }
    }
};

var appInfo_template = {
    "appId" : "",
    "appResource" : {
        "decription" : "",
        "icon" : "",
        "id" : "",
        "isMaintain" : "false",
        "lastModifyTime" : "123456",
        "name" : "",
        "status" : "available",
        "switcher" : "normal",
    },
}

exports.fill_usertoken = function fill_usertoken(userid, username, domain) {
    var tokenjson = JSON.parse(JSON.stringify(usertoken_template));
    tokenjson.token = userid;
    tokenjson.tokeninfo.expires_at = "start_time";
    tokenjson.tokeninfo.issued_at = "end_time";
    tokenjson.tokeninfo.user.domain = domain;
    tokenjson.tokeninfo.user.name = username;
    tokenjson.tokeninfo.user.usnid = userid;
    tokenjson.tokeninfo.user.id = userid;

    return tokenjson;
}

exports.fill_appInfo = function fill_appInfo(appid, appicon, appname) {
    var appInfo = JSON.parse(JSON.stringify(appInfo_template));

    appInfo.appId = appid;
    appInfo.appResource.icon = appicon;
    appInfo.appResource.id = appid;
    appInfo.appResource.name = appname;

    return appInfo;
}