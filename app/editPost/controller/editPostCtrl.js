
angular.module('editPost').controller('editBlogPostCtrl', ['$scope', '$rootScope', '$state', '$http',
    'toastr', 'blogService','$window','profileService', function($scope, $rootScope, $state,
          $http, toastr, blogService,$window,profileService) {

    $scope.init = function(){
        $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        $scope.editBlogPost = JSON.parse($window.localStorage.getItem('editPost'));
        $scope.postNumber = $scope.editBlogPost.postNumber;
        $scope.email = $scope.userLocalStorage.email;
        $scope.fetchBlogData();
    };

    $scope.saveBlogPost = function(){
        var content =  CKEDITOR.instances['editor1'].getData();
        $scope.editBlogPost.postDetailDescription = content;
      /*  $scope.editBlogPost.postDetails.$scope.postNumber.postDetailDescription = content;*/
        $scope.editBlogPost.bloggerName = $scope.userLocalStorage.fullName;
        $scope.editBlogPost.postDate = dateToYMD(new Date());
        $scope.savePostDetailDescriptionCloud(content,$scope.editBlogPost,$scope.saveBlogPostDetailDescription);
       // $scope.saveBlogPostDetailDescription($scope.savePostDetailDescriptionCloud(content,$scope.editBlogPost));

    };


    $scope.saveBlogPostDetailDescription = function(){
        var data =
            {
                /*postDetailDescription:$scope.editBlogPost.postDetailDescription,*/
                postDetailDescription: $scope.postDetailDescriptionCloudKey,
                email:$scope.email
            };

        $http.put('/myBlogPostDetailDescription/' +  $scope.postNumber, data).success(function(response) {
            console.log(response);
            alert("2");
            toastr.success('Post created successfully.');
            $scope.fetchBlogData();
        });
    }


    $scope.savePostDetailDescriptionCloud = function(content,BlogDetail,callback){
        var postName = BlogDetail.postName.replace(/\s/g, "");
        var uniqueUser = $scope.email.replace(/\s/g, "");
        uniqueUser = uniqueUser.toLowerCase();
        uniqueUser = uniqueUser.replace(/[^a-zA-Z ]/g, "");
        var useremail =  $scope.email.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

        var postDetailDescriptionUrl = {
            postDetailDescriptionUrlCloud : $scope.postDetailDescriptionUrl,
            postDetailDescription : content
        };
        var postDetailDescription = {
            postDetailDescription : content,
            email:useremail + Number(new Date()) + $scope.userLocalStorage.id,
            generatedPostNameCloud : BlogDetail.postName + Number(new Date()) + BlogDetail.postKey,
            userEmail: useremail + $scope.userLocalStorage.id,
            postName: postName.toLowerCase(),
            postKey: BlogDetail.postKey,
            userId: $scope.userLocalStorage.id
        };
        if($scope.postDetailDescriptionUrl){
            $http.post('/updatepostdetaildescription', postDetailDescriptionUrl).then(function(response) {
                /* toastr.success('Employer profile created successfully.');*/
                alert("update");
                console.log("here is the data");
                $scope.postDetailDescriptionCloudKey = response.data;
                console.log(response);
                callback && callback();
                $scope.getPostDetailDescription($scope.postDetailDescriptionCloudKey);
            });
        }else{
            $http.post('/postdetaildescription', postDetailDescription).then(function(response) {
                /* toastr.success('Employer profile created successfully.');*/
                alert("1");
                console.log("here is the data");
                $scope.postDetailDescriptionCloudKey = response.data;
                console.log(response);
                callback && callback();
                $scope.getPostDetailDescription($scope.postDetailDescriptionCloudKey);
            });
        }
    };

    $scope.getPostDetailDescription = function(id){
        $scope.ObjMessage = {};
        $http.get('/getpostdetaildescription',{params: {id: id}}).then(function(response) {
            console.log("cloud data");
            console.log(response);
           /* $scope.ObjMessage.messageData = JSON.parse(response.data);
            $("#editor1").val($scope.ObjMessage.messageData);*/
            CKEDITOR.instances.editor1.setData(JSON.parse(response.data));
        });
    };

    function dateToYMD(date) {
        var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var d = date.getDate();
        var m = strArray[date.getMonth()];
        var y = date.getFullYear();
        return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;
    }

    $scope.fetchBlogData = function(){
        /* $scope.userProfileEmailId =  $window.localStorage.getItem('userProfileEmailId')*/
        $scope.postList = [];
        $scope.postNameList = [];
        if($scope.userLocalStorage.email){
            blogService.getBlogDetailDescriptionCloudUrl($scope.editBlogPost.postKey).then(function (response) {
                if(response.data){
                    $scope.editBlogPost = response.data[0]._id.BlogDetail;
                    $scope.postDetailDescriptionUrl = $scope.editBlogPost.postDetailDescription;
                    console.log($scope.editBlogPost.postDescription);
                    if($scope.postDetailDescriptionUrl){
                        $scope.getPostDetailDescription($scope.postDetailDescriptionUrl);
                    }
                }
            });
        }else{
            $scope.userFirstTimeBlogPostCreated = true;
        }
    };


    $scope.$watch('myUpload', function(newVal) {
        alert("data");
        $scope.fileName = newVal.name;
        var uploadFile = newVal;
        var uploadUrl = "/uploads";
        var file = {
            file: uploadFile
        }
        var fd = new FormData();
        fd.append('file', uploadFile);
        fd.append('userDetail', JSON.stringify($scope.editBlogPost))
        $http.put('/postUpload/' + $scope.userLocalStorage.email, fd,
            {
                headers: {
                    'Content-Type': undefined
                }
            }).success(function(response) {
            console.log(response);
        }).success(function(data) {

        })
            .error(function() {
                console.log("error!!");
            });
    })

    $scope.hexToBase64 = function(str) {
        alert("data");
        return str;
    }




    $scope.init();


}]);