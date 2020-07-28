
var postDetailDescriptionBucket = 'postdetaildescriptiondetail';
/********************amazon cloud s3*******************/
/******************************************************/

/********************amazon cloud s3*******************/
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    accessKeyId: 'AKIAIR4NW2ETMGBORWZQ',
    secretAccessKey: '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'
});
/******************************************************/




/*------------------------------------------Save post Detail Description --------------------------------------------------*/
exports.postDetailDescription = function (req, res) {
    var item = req.body;
    console.log("cloudpppp");
    console.log(item);
     var dataKey = "myBlog" + "/" +item.userEmail + "/" + item.email + Number(new Date()) + "/" + item.userId  + Number(new Date())  +
         "/"  + item.postKey  + Number(new Date()) +   item.generatedPostNameCloud + ".json";
     var paramData = {
        Bucket: postDetailDescriptionBucket,
        Key: dataKey ,
        Body: JSON.stringify(item.postDetailDescription),
        ContentType: "application/json"};
    s3.putObject(paramData,
        function (err,data) {
            console.log("**************asdasdasdsad*********************************");
           // console.log(JSON.stringify(err) + " " + JSON.stringify(data));
            console.log(paramData.key);
            if (!err) {
                res.send(dataKey);
            }else{
                res.send(data);
            }


        }
    );
};

/*------------------------------------------Update post Detail Description --------------------------------------------------*/
exports.updatePostDetailDescription = function (req, res) {
    var item = req.body;
    console.log("cloudppppupdate");
    console.log(item);

     var datakey = item.postDetailDescriptionUrlCloud;
    var param = {
        Bucket: postDetailDescriptionBucket,
        Key:  datakey,
        Body: JSON.stringify(item.postDetailDescription),
        ContentType: "application/json"}

    s3.deleteObject({
        Bucket: postDetailDescriptionBucket,
        Key:  datakey} ,function(err, data) {
        if (err) {
            console.log(err, err.stack);  // error
        }
        else{
            console.log();                 // deleted
            s3.putObject(param,
                function (err,data) {
                    console.log("***********************************************");
                    console.log(JSON.stringify(err) + " " + JSON.stringify(data));
                    if (!err) {
                        res.send(datakey);
                    }else{
                        res.send(data);
                    }
                }
            );
        }

    });



};

exports.getPostDetailDesceription = function(req,res){
    var id = req.query.id;
    var params = {
        Bucket: postDetailDescriptionBucket,
        Key: id

    };
    //s3.getSignedUrl('getObject',params,function(err, data)
    s3.getObject(params,function(err, data)
    {
        console.log("return cloud data");
        console.log(data);
        res.send(data.Body);
    });
};





