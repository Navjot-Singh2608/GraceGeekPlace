var mongo = require('mongodb');
var JSONCreate = require("./JSONCreate");
var mongoose = require('mongoose');
var crypto = require("crypto");
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");
var methodOvverride = require("method-override");
var bodyParser = require("body-parser");
var collectionName = 'student';

//Init gfs
var gfs;




var Server = mongo.Server,

    Db = mongo.Db;
//    BSON = mongo.BSONPure;
var BSON = require('bson').BSONPure;
var ObjectID = require("bson-objectid");

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('GraceProjectDB', server);


// db.once('open',function () {
//     //Init Stream
//     gfs = Grid(db.db,mongoose.mongo);
//     gfs.collection(collectionName);
// });

//Create Storage Engine
/*const storage = new GridFsStorage({
    url: server,
    file: (req, file) => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
const fileInfo = {
    filename: filename,
    bucketName: collectionName
};
resolve(fileInfo);
});
});
}
});*/


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


exports.findById = function (req, res) {
    var ObjectId = require('mongodb').ObjectID;
    var email = req.query.id;
    console.log("asdfasdasdasdas");
    console.log(email);
    db.collection(collectionName, function (err, collection) {
        collection.findOne({'email': email}, function (err, docs) {
            console.log("here is the data");
            console.log(docs);
            res.json(docs);
        });
    });

};

/*--------------------------------------------Get All Users Details------------------------------------------------*/
exports.getAllStudentsPofiles = function (req, res) {
    db.collection(collectionName, function (err, collection) {
        collection.find({}).toArray(function(error, documents) {
            if (err) throw error;

            res.send(documents);
        });
    });

};


/*------------------------------------------Save user Profile data--------------------------------------------------*/
exports.saveStudentProfile = function (req, res) {
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

/*------------------------------------------Save user Profile data By Image--------------------------------------------------*/
exports.saveUserProfileByImage = function (req, res) {
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

/*----------------------------------------Update user Profile data----------------------------------------------------*/
exports.updateStudentProfile = function (req, res) {
    var email = req.params.id;
    var appItem = req.body;
    console.log("skills");
    console.log(req.params);
    var collection = db.collection("student");
    collection.update({'email': email},
        {
            'fullName': appItem.fullName,
            'experience': appItem.experience,
            'contactNumber': appItem.contactNumber,
            'email': appItem.email,
            'hourRate': appItem.hourRate,
            'comment': appItem.comment,
            'role': appItem.role,
            'position': appItem.position,
            'city': appItem.city,
            'state': appItem.state,
            'country': appItem.country,
            'skills': appItem.skills,
            'checked': appItem.checked
        },
        {safe: true}, function (err, result) {
            if (err) {
                console.log('Error updating AppItem: ' + err);
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(appItem);
            }
        });
};

