let Service = require('node-windows').Service;
 
let svc = new Service({
    name: 'WeixunServer Portal',
    description: 'WeixunServer简易接入管理系统',
    script: require('path').join(__dirname, './src/backend/webserver.js')
});
 
svc.on('install', () => {
    svc.start();
});

svc.install();