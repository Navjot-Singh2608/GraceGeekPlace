var mongo = require('mongodb');
var JSONCreate = require("./JSONCreate");
var collectionName = 'myPosts';
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
exports.createPost = function (req, res) {
    var item = req.body;
    console.log("here is the data>>>>>>>>>>>>>>>>>>>>>>");
    console.log(item);
    db.collection(collectionName, function (err, collection) {
        collection.insert(item, {safe: true}, function (err, result) {

            console.log("err");
            console.log(err);
            console.log("result");
            console.log(result);
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};;

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
            'presenceStatus': appItem.presenceStatus
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
