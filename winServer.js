let Service = require('node-windows').Service;
 
let svc = new Service({
    name: 'WeixunServer Portal',
    description: 'WeixunServer简易接入管理系统',
    script: 'C:/Program Files (x86)/WeixunServer/WeixunServer Portal/web_portal/webserver.js'
});
 
svc.on('install', () => {
    svc.start();
});
 
svc.install();