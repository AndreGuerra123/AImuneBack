require('async');
var grid = require('gridfs-stream');
var fs = require('fs-extra')
var should = require('chai').should();
var OID = require('mongodb').ObjectID;

function validate(obj) {
    should.exist(obj)
}

function validate_oid(id) {
    should.be.true(OID.isValid(id), id.toString() + ' is not a valid ObjectID.');
    return id.toString();
}

function validate_path(path) {
    fs.pathExists(path).then(exists => {
        should.be.true(exists)
    }).catch(err => {
        throw err;
    })
}

function easyGridFS(db, driver) {

    this.gfs = grid(db, driver);

    this.saveFile = function (path, name, callback) {

        try {
            validate(name)
            validate_path(path)
        } catch (err) {
            callback(err, null)
        }

        this.gfs.createWriteStream({
                filename: name
            },
            function (err, writestream) {
                if (err) callback(err, null);
                else {
                    fs.createReadStream(path).pipe(writestream);
                    writestream.on('close', function (file) {
                        callback(null, file);
                    });
                }
            });
    };

    this.getFileInfo = function (id, callback) {
        try {
            id = validate_oid(id)
        } catch (err) {
            callback(err, null)
        }

        this.gfs.findOne({
            _id: id
        }, function (err, file) {
            if (err) callback(err, null);
            else if (!file) callback('File not found.', null);
            else callback(null, file);
        });

    };

    this.getFileData = function (id, callback) {
        
        try {
            id = validate_oid(id)
        } catch (err) {
            callback(err, null)
        }

        let contentType = null;
        let data = [];

        this.gfs.findOne({
            _id: id
        }, function (err, file) {
            if (err) callback(err, null);
            else {
                contentType = file.contentType
            }
        })
        this.gfs.createReadStream({
            _id: id
        }, function (err, rs) {
            if (err) callback(err, null);
            else {
                rs.on('data', function (chunk) {
                    data.push(chunk);
                });
                rs.on('end', function () {
                    data = Buffer.concat(data);
                    callback(null, 'data:' + contentType + ';base64,' + Buffer(data).toString('base64'));
                });
            }
        });

    };


    this.getFileBase64 = function (id, callback) {

        try {
            id = validate_oid(id)
        } catch (err) {
            callback(err, null)
        }

        let data = [];

        this.gfs.createReadStream({
            _id: id
        }, function (err, rs) {
            if (err) callback(err, null);
            else {
                rs.on('data', function (chunk) {
                    data.push(chunk);
                });
                rs.on('end', function () {
                    data = Buffer.concat(data);
                    callback(null, Buffer(data).toString('base64'));
                });
                rs.on('error', function (err) {
                    callback(err, null);
                });
            }
        });

    };

    this.removeFile = function (id, callback) {

        try {
            id = validate_oid(id)
        } catch (err) {
            callback(err, null)
        }

        this.gfs.remove({
            _id: id
        }, function (err, result) {
            if (err) callback(err, null);
            else if (result) callback(null, result);
        });

    };

    this.existFile = function (id, callback) {
        try {
            id = validate_oid(id)
        } catch (err) {
            callback(err, null)
        }

        this.gfs.exist({
            _id: id
        }, function (err, found) {
            if (err) callback(err, null);
            else callback(null, found);
        });
    };

    return this;
}

module.exports = easyGridFS;