var express = require("express");
var router = express.Router();
var path = require("path");
var crypto = require("crypto");
var GridFsStorage = require("multer-gridfs-storage");
var Grid = require("gridfs-stream");
var file = require('file-system');
var fs = require('mz/fs');
var methodOvverride = require("method-override");
var bodyParser = require("body-parser");
var app = express();
var http = require('http');
var passport = require('passport');
// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());
app.use(bodyParser.urlencoded({ extended: false }));
// [SH] Bring in the data model
var dbConfig =require('./routes/Model/dbconfig');
var auth=require("./routes/authentication");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var fs = require('fs');
var busboy = require('connect-busboy');
router.use(busboy());

var HOME_URL = 'http://localhost:3000';
var IMG_FOLDER = '/images/file/test/';


var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();




app.use(bodyParser.urlencoded({ extended: false }));


app.set('superSecret', dbConfig.secret); // secret variable
app.use(bodyParser.json());
app.use(methodOvverride('_method'));
app.use(express.static(__dirname));

var gfs;

var imageAPI=require("./routes/imageAPI");
var profile=require("./routes/profile");
var myBlog=require("./routes/blog");
var myPost=require("./routes/myPosts");
var hireUser=require("./routes/hireUser");
var freelancer=require("./routes/freelancer");
var student=require("./routes/student");
var teacher=require("./routes/teacher");
var employer=require("./routes/employer");

var server = http.createServer(app);
// get an instance of the router for api routes
var apiRoutes = express.Router();
// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});



// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token,"test", function(err, decoded) {
            if (err) {
                //  res.redirect('http://google.com');
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
})


/*app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(__dirname));*/

app.use(express.static(path.join(__dirname, 'lib')));

/*app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});*/


/*------------------------------------------Authentication-------------------------------------------------------------------*/
app.post('/register',auth.registerUser);
app.post('/login',auth.LoginUser);


/*-----------------------------------------User Profile----------------------------------------------------------------------*/


app.get('/profile', profile.findById);
app.get('/all/profile', profile.getAllUsersDetails);
app.post('/profile', profile.saveUserProfile);
app.put('/profile/:id', profile.updateUserProfile);
app.get('/profile/filenames',profile.getAllFilesNames);


/*-----------------------------------------Freelancer Profile----------------------------------------------------------------------*/


/*app.get('/profile', freelancer.findById);*/
app.get('/all/freelancer', freelancer.getAllFreelancerProfiles);
app.post('/freelancer', freelancer.saveFreelancerProfile);
app.put('/freelancer/:id', freelancer.updateFreelancerProfile);

/*-----------------------------------------Student Profile----------------------------------------------------------------------*/


/*app.get('/profile', freelancer.findById);*/
app.get('/all/student', student.getAllStudentsPofiles);
app.post('/student', student.saveStudentProfile);
app.put('/student/:id', student.updateStudentProfile);

/*-----------------------------------------Teacher Profile----------------------------------------------------------------------*/


/*app.get('/profile', freelancer.findById);*/
app.get('/all/teacher', teacher.getAllTeacherProfiles);
app.post('/teacher', teacher.saveTeacherProfile);
app.put('/teacher/:id', teacher.updateTeacherProfile);

/*-----------------------------------------Employer Profile----------------------------------------------------------------------*/


/*app.get('/profile', freelancer.findById);*/
app.get('/all/employer', employer.getAllEmployersDetails);
app.post('/employer', employer.saveEmployerProfile);
app.put('/employer/:id', employer.updateEmployerProfile);

/*-----------------------------------------User Blogs----------------------------------------------------------------------*/


app.get('/myBlog', myBlog.findById);
app.get('/all/blog', myBlog.getAllUsersDetails);
app.post('/myBlog', myBlog.createBlog);
app.put('/myBlog/:id', myBlog.updateUserProfile);
app.put('/myBlogPost/:id', myBlog.updateUserBlogPost);

/*-----------------------------------------User Blogs----------------------------------------------------------------------*/


app.get('/myPost', myPost.findById);
app.get('/all/Post', myPost.getAllUsersDetails);
app.post('/myPost', myPost.createPost);
app.put('/myPost/:id', myPost.updateUserProfile);

/*-----------------------------------------User Blogs----------------------------------------------------------------------*/


/*
app.get('/myPost', myPost.findById);
app.get('/all/Post', myPost.getAllUsersDetails);
app.post('/hireUser', hireUser.saveHireUserProfile);
app.put('/myPost/:id', myPost.updateUserProfile);
*/
/*-----------------------------------------CK editor File uploader---------------------------------------------------------*/
router.post('/uploader', multipartMiddleware, function(req, res) {
    var fs = require('fs');
      console.log("here is the data")
    fs.readFile(req.files.upload.path, function (err, data) {
        var newPath = __dirname + '/../public/uploads/' + req.files.upload.name;
        console.log(newPath);
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log({err: err});
            else {
                html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";

                res.send(html);
            }
        });
    });
});


/*-----------------------------------------Image Upload----------------------------------------------------------------------*/
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './userProfileImage')
    },
    filename: function (req, file, cb) {
         console.log('file request');
        var datetimestamp = Date.now();
        console.log('here');
        console.log(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        cb(null, file.originalname);

    }
});
var upload = multer({ storage: storage });

app.post('/uploads', upload.single('file'),imageAPI.uploadImage);
app.post('/deleteImageFile', imageAPI.deleteImage);

/*******************************editor Image Upload*************************************/

router.all('/browse_url', function (req, res) {
    var data = {};
    var dirname = process.cwd() + '/public/' + IMG_FOLDER;
    fs.readdir(dirname, function(err, filenames) {
        if (err) {
            return err;
        }
        var data = [];
        filenames.forEach(function(filename) {
            data.push({
                "image": HOME_URL + IMG_FOLDER + filename,
                "thumb": HOME_URL + IMG_FOLDER + filename,
                "folder": "Small"
            });
        });
        //console.log(data);
        res.send(data);
    });

});

router.post('/upload_url', function (req, res) {
    var fstream;
    var msg = "";
    var CKEcallback = req.query.CKEditorFuncNum;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        //console.dir(file);
        fstream = fs.createWriteStream(process.cwd() + '/public/' + IMG_FOLDER + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            //res.redirect('back');
            var fileUrl =  process.cwd() + '/public/' + IMG_FOLDER + filename;
            fs.chmodSync(fileUrl, 0777);
            fileUrl = HOME_URL + IMG_FOLDER + filename;
            res.send("<script type='text/javascript'>\
      (function(){var d=document.domain;while (true){try{var A=window.parent.document.domain;break;}catch(e) {};d=d.replace(/.*?(?:\.|$)/,'');if (d.length==0) break;try{document.domain=d;}catch (e){break;}}})();\
      window.parent.CKEDITOR.tools.callFunction('" + CKEcallback + "','" + fileUrl + "', '" +  msg + "');\
      </script>");

        });

    });
});




var server = http.createServer(app);
server.listen(process.env.PORT || 3000);
console.log("server running on port 3000");


// serve angular front end files from root path
app.use('/', express.static(path.join(__dirname, 'app'), { redirect: false }));

// rewrite virtual urls to angular app to enable refreshing of internal pages
app.get('*', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

