var mongo = require('mongodb');
var JSONCreate = require("./JSONCreate");
var collectionName = 'myBlog';
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
    console.log("$$$$$$$$$$$$$$$$$$$$");
    db.collection(collectionName, function (err, collection) {
        collection.find({}).toArray(function(error, documents) {
            if (err) throw error;
             console.log("$$$$$$$$$$$$$$$$$$$$");
             console.log(documents);
            res.send(documents);
        });
    });

};


/*------------------------------------------Save user Profile data--------------------------------------------------*/
exports.createBlog = function (req, res) {
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
};

/*----------------------------------------Update user Blog data----------------------------------------------------*/
exports.updateUserProfile = function (req, res) {
    var email = req.params.id;
    var appItem = req.body;
    var collection = db.collection("myBlog");
    collection.update({'email': email},
        {
            'blogName': appItem.blogName,
            'blogDescription': appItem.blogDescription,
            'email': appItem.email,
            'postDetails': appItem.postDetails
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


/*----------------------------------------Update user Blog Post data----------------------------------------------------*/
exports.updateUserBlogPost = function (req, res) {
    var postNumber = req.params.id;
    var appItem = req.body;
    console.log("wuertweurtweurtrtrtrtrtrtrtrtrtrtrtrtrtrt................");
    console.log(appItem);
    var postName = "postDetails"[appItem.blogName];

    var setObject = {};
    setObject["postDetails.postDescription"] = appItem;


    var customObj = {

    }
    /*customObj['postDetails.' + postNumber + '.postNumber'] = postNumber;*/

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<");
    console.log(customObj);


    var collection = db.collection("myBlog");
    collection.update({'postDetails.postDescription.postNumber':postNumber.toString()},{ $set:   setObject},
        /*{
            'postName': appItem.blogName,
            'topicCovered': appItem.blogDescription,
            'languageUsed': appItem.email,
            'postDescription': appItem.postDetails
        },*/
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

