var db = require('./db/db.js');
var server_config = db.load_server_config();

let Service = require('node-windows').Service;
 
let svc = new Service({
    name: 'WeixunServer Portal',
    description: 'WeixunServer简易接入管理系统',
    script: server_config.server_dir + '/webserver.js'
});
 
svc.on('install', () => {
    svc.start();
});
 
svc.install();