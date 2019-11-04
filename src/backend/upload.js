var fs = require('fs');
var express = require('express');
var multer  = require('multer');
var utils = require('./webserver-utils.js');

var router = express.Router();
var upload = multer({dest: 'upload_tmp/'});

router.post('/', upload.any(), function(req, res, next) {
    console.log(req.files[0]);
    var dst_name = utils.guid() + ".png";
    var des_file = "./public/appicon/" + dst_name;
    console.log(des_file);
    fs.readFile( req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            response = {
                statuse: "failed",
                filename: "",
                thumbUrl: "",
                url: ""
            };

            if (err != null){
                console.log( err );
            } else {
                response.statuse= "success",
                response.name = dst_name;
                response.thumbUrl = "./appicon/" + dst_name;
                response.url = "./appicon/" + dst_name;
            }

            res.send(response);
        });
    });
});

module.exports = router;