var mongo = require('mongodb');
var JSONCreate = require("./JSONCreate");
var mongoose = require('mongoose');
var crypto = require("crypto");
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");
var methodOvverride = require("method-override");
var bodyParser = require("body-parser");
var collectionName = 'hireUser';

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
    db.collection(collectionName, function (err, collection) {
        collection.find({}).toArray(function(error, documents) {
            if (err) throw error;

            res.send(documents);
        });
    });

};


/*------------------------------------------Save user Profile data--------------------------------------------------*/
exports.saveHireUserProfile = function (req, res) {
    var item = req.body;
    var role = req.body.role;

    var obj = {};
    var ID = req.body.role;
    obj[ID] = {};

    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log(role);


        /*var role = role[req.body.role] = {};*/

   /* roleObj[req.body.role] = {};*/
 /*  var hireProfileObject = db.collection('hireUser').find({ 'req.body.role' : { '$exists' : true }});*/

    db.collection("hireUser").findOne({ 'freelancer':req.body.role}, function(error, result) {
        console.log("---------------------------------------------------");
        console.log(result);
        if (!error) {
            if (result) {
                console.log("Item exists");
                    collection.insert(item, {safe: true}, function (err, result) {
                        if (err) {
                            res.send({'error': 'An error has occurred'});
                        } else {
                            console.log('Success: ' + JSON.stringify(result[0]));
                            res.send(result[0]);
                        }
                    });
            } else {
                console.log("Item not exists");
               /* return false;*/
                db.collection(collectionName, function (err, collection) {
                    collection.insert(obj, {safe: true}, function (err, result) {
                        if (err) {
                            res.send({'error': 'An error has occurred'});
                        } else {
                            console.log('Success: ' + JSON.stringify(result[0]));
                            res.send(result[0]);
                        }
                    });
                });
            }
        } else {
            console.log("MongoDB error");
        }
    });






  /* console.log("7777777777777777777777777");
   console.log(hireProfileObject);
   if(!hireProfileObject){
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
   }else{
      return item;
   }*/
  /*  db.collection(collectionName, function (err, collection) {
        collection.insert(item, {safe: true}, function (err, result) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });*/
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
            'userPicName': appItem.userPicName,
            'skillsQuotes': appItem.skillsQuotes,
            'presenceStatus': appItem.presenceStatus,
            'userRole': appItem.userRole
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
