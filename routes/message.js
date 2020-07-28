var mongo = require('mongodb');
var JSONCreate = require("./JSONCreate");
var mongoose = require('mongoose');
var crypto = require("crypto");
var fs = require('mz/fs');
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");
var methodOvverride = require("method-override");
var bodyParser = require("body-parser");
var collectionName = 'message';

//Init gfs
var gfs;




var Server = mongo.Server,

    Db = mongo.Db;
//    BSON = mongo.BSONPure;
var BSON = require('bson').BSONPure;
var ObjectID = require("bson-objectid");

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('GraceProjectDB', server);


db.open(function (err, db) {
    if (!err) {
        //console.log("Connected to 'AppCreaterDB' database");
        db.collection(collectionName, {strict: true}, function (err, collection) {
            if (err) {
                // console.log("The 'DashBoard' collection doesn't exist. Creating it with sample data...");
                //   populateDB();
            }
        });
    }
});


/*--------------------------------------------Get All Users Query------------------------------------------------*/
exports.getAllUsersDetails = function (req, res) {
    db.collection(collectionName, function (err, collection) {
        collection.find({}).toArray(function(error, documents) {
            if (err) throw error;

            res.send(documents);
        });
    });

};


/*------------------------------------------Save user Profile data--------------------------------------------------*/
exports.createUserQuery = function (req, res) {
    var item = req.body;
    console.log("user Query>>>>>>>>>>>>>>>>>>>>>");
    console.log(item);
    var item = req.body;
    db.collection(collectionName, function (err, collection) {
        collection.insert(item, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

