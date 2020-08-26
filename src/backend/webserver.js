var express = require('express');
var app = express();
var path = require('path');
var multer  = require('multer');
var bodyParser = require('body-parser');

var userportal = require('./userportal.js');
var adminPortal = require('./adminportal.js');
var db = require('./db/db.js');
var server_config = db.load_server_config();

var upload = require('./upload.js');

app.use('/uploadicon', upload);

app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 
app.get('/autologin', userportal.autologin);
app.post('/login', userportal.login);
app.get('/vPortal/V1.0/userportal/login/getPublicKey', userportal.getPublicKey);
app.get('/vPortal/V1.0/userportal/login/app', userportal.appGetToken);
app.get('/vPortal/V1.0/userportal/login/token/:token', userportal.updateToken);
app.get('/vPortal/V1.0/userportal/controller-manage/app/:token', userportal.getAppList);
app.get('/vPortal/V1.0/userportal/controller-manage/app/:token/:appid/connectParamIni', userportal.getAppConnectionFile);
app.get('/vPortal/V1.0/userportal/controller-manage/app/:token/:appid/mimetype', userportal.getAppMimeTypeList);

app.get('/vPortal/V1.0/userportal/controller-manage/desktop/:token', userportal.getDesktopList);
app.get('/vPortal/V1.0/userportal/controller-manage/desktop/:token/:desktopid/connectParamIni', userportal.getDesktopConnectionFile);

app.get('/adminPortal/user/list', adminPortal.list_user);
app.post('/adminPortal/user/add', adminPortal.add_user);
app.post('/adminPortal/user/update', adminPortal.update_user);
app.post('/adminPortal/user/del', adminPortal.del_user);

app.get('/adminPortal/appgroup/list', adminPortal.list_appgroup);
app.post('/adminPortal/appgroup/add', adminPortal.add_appgroup);
app.post('/adminPortal/appgroup/update', adminPortal.update_appgroup);
app.post('/adminPortal/appgroup/del', adminPortal.del_appgroup);

app.get('/adminPortal/appgroup/:id/list_app', adminPortal.list_app);
app.post('/adminPortal/appgroup/:id/add', adminPortal.add_app_to_appgroup);
app.post('/adminPortal/appgroup/:id/del', adminPortal.del_app_from_appgroup);

app.get('/adminPortal/desktopgroup/list', adminPortal.list_desktopgroup);
app.post('/adminPortal/desktopgroup/add', adminPortal.add_desktopgroup);
app.post('/adminPortal/desktopgroup/update', adminPortal.update_desktopgroup);
app.post('/adminPortal/desktopgroup/del', adminPortal.del_desktopgroup);

app.get('/adminPortal/desktopgroup/:id/list_desktop', adminPortal.list_desktop);
app.post('/adminPortal/desktopgroup/:id/add', adminPortal.add_desktop_to_desktopgroup);
app.post('/adminPortal/desktopgroup/:id/del', adminPortal.del_desktop_from_desktopgroup);

app.get('/', userportal.indexRedirection);
 
var server = app.listen(server_config.listen_port, function () {
    var port = server.address().port;
    console.log("start listening at %s", port);
});