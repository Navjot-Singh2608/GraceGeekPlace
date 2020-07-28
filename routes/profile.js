var mongo = require('mongodb');
var JSONCreate = require("./JSONCreate");
var mongoose = require('mongoose');
var crypto = require("crypto");
var fs = require('mz/fs');
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");
var methodOvverride = require("method-override");
var bodyParser = require("body-parser");
var collectionName = 'userprofile';

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
exports.getAllUsersDetails = function (req, res) {

   var selectedLang = req.query.selectedLang;

   db.collection(collectionName, function (err, collection) {
        collection.find({"skills.text":selectedLang}).toArray(function(error, documents) {
            if (err) throw error;
            res.send(documents);
        });
    });

};


/*------------------------------------------Save user Profile data--------------------------------------------------*/
exports.saveUserProfile = function (req, res) {
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


exports.getAllFilesNames = function(req,res){
    console.log("get the files");
   /* getFiles('./userProfileImage/');*/
    var dir = "./userProfileImage/";
    var files_ = "";
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    console.log(files_);

    res.send(files_);
   /* console.log(getFiles(''));*/
};
/*function getFiles (dir, files_){

}*/


/*----------------------------------------Update user Profile data----------------------------------------------------*/
exports.updateUserProfile = function (req, res) {
    var email = req.params.id;
    var appItem = req.body;
    console.log("skills");
    console.log(req.params);
    var collection = db.collection("userprofile");
    collection.update({'email': email},
        {
            'fullName': appItem.fullName,
            'email': appItem.email,
            'company': appItem.company,
            'experience': appItem.experience,
            'skills': appItem.skills,
            'position': appItem.position,
            'country': appItem.country,
            'state': appItem.state,
            'city': appItem.city,
            'userPicName': appItem.userPicName,
            'skillsQuotes': appItem.skillsQuotes,
            'presenceStatus': appItem.presenceStatus,
            'userRole': appItem.userRole,
            'education':appItem.education
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
