'use strict';
angular.module('myPosts').controller('postsCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr', 'blogService','$window','profileService', function($scope, $rootScope, $state, $http, toastr, blogService,$window,profileService) {


    $scope.init = function(){
        $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        $scope.postNameList = [];
        $scope.postList = [];

        $scope.myBlog = JSON.parse($window.localStorage.getItem('myBlog'));
        $scope.myBlog.postDetails = [];
        $scope.myPost = {
            postName :"",
            topicCovered:"",
            languageUsed:"",
            postDescription:"",
            postDetailDescription:"",
            postNumber:""
        };
        $scope.fetchBlogData();
        $scope.allLanguagesData();

    };


    $(document).ready(function(){
        $(this).scrollTop(0);
        var table;
        $scope.userProfileDetails1 = [];
        var userProfileChannels = [];
      /*  $('#example').DataTable();*/
        $scope.usersData = [1, 2, 3, 4, 5, 30, 31];
        setTimeout(function(){
            table = $('#dtBasicExample').DataTable({
                'destroy': true,
                'paging': true,
                'lengthChange': true,
                'searching': true,
                'ordering': true,
                "pageLength": 7,
                'info': true,
                'autoWidth': true,
                "initComplete": function( settings, json ) {
                   /* alert("data");*/
                }
            });
            table = $('.dataTables_length').addClass('bs-select');
            $(".chatTabId").css({"padding-bottom": "2px","margin-bottom": "-20px","margin-top": "-3px"});
        }, 1000);
    });

    $scope.createPost = function(){
        setTimeout(function(){
            $(this).scrollTop(0);
        }, 100);

    };



    $scope.savePost = function(){


        $scope.postNumber = Date.now() + Math.random();
        $scope.postNumber = Math.trunc($scope.postNumber);
        $scope.myPost.postNumber = $scope.postNumber.toString();
        $scope.myPost.languageUsed = [];
        angular.forEach($scope.output_data, function(value, key) {
            $scope.myPost.languageUsed.push(value.text)
        });
        var status = $scope.postValidation();
        if(status == true){
           /* $scope.myBlog.postDetail.*/

            $scope.myBlog.postDetails["postDescription"] = $scope.myPost;
            $scope.myBlog["postNumber"] = $scope.postNumber;
            $http.put('/myBlog/' + $scope.myBlog.email, $scope.myBlog).success(function(response) {
                console.log(response);
                toastr.success('Post created successfully.');
                $scope.fetchBlogData();
            })
        }
        else if(status == "duplicate"){
            toastr.success('Post Name can not be duplicate.');
        }
        else{
            toastr.error('Post Name and Description are Mandatory.');
        }
    };

    $scope.fetchBlogData = function(){
        /* $scope.userProfileEmailId =  $window.localStorage.getItem('userProfileEmailId')*/
        $scope.postList = [];
        $scope.postNameList = [];
        if($scope.userLocalStorage.email){
            blogService.getBlogData($scope.userLocalStorage.email).then(function (response) {
                if(response.data.blogName){
                    $scope.myBlog = response.data;
                   /* $window.localStorage.setItem('myBlog', JSON.stringify(myBlog));*/
                    var postDetails = Object.size($scope.myBlog.postDetails);
                    if(postDetails!=0){
                        angular.forEach($scope.myBlog.postDetails, function(post, postKey) {
                            $scope.postList.push(post);
                            $scope.postNameList.push(postKey);
                        });
                    }else{
                        $scope.myBlog.postDetails = {};
                    }
                    $scope.userFirstTimeBlogCreated = false;
                }
            })
        }else{
            $scope.userFirstTimeBlogCreated = true;
        }
    };

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

// Get the size of an object
  /*  var size = Object.size(myArray);*/


    $scope.deleteConfirmation = function(postName){
        $scope.deleteConfirmationPostName = postName;
        $('#deletePostConfirmation').modal('show');
    };


    $scope.postValidation = function(){
        var  i = 0;
        if($scope.myPost.postName != '' && $scope.myPost.postDescription != '') {
            for( i = 0;i<$scope.postNameList.length;i++){
                if($scope.myPost.postName!=$scope.postNameList[i]){
                    return true;
                }
            }
            if($scope.postNameList.length == 0){
                return true;
            }
            return "duplicate";
        }else{
            return false;
        }
    };


    $scope.allLanguagesData = function(){
        $http.get('json/allLanguages.json').then(function(response) {
            $scope.input_data = response.data;
              /*  angular.forEach($scope.user.skills, function(userSkill){
                    angular.forEach($scope.input_data, function(actualSkill){
                        if(userSkill.text == actualSkill.text){
                            actualSkill.checked = true;
                        }
                    });
                });*/
        });
    };


    $scope.deletePost = function(){
        delete  $scope.myBlog.postDetails[$scope.deleteConfirmationPostName];
        $http.put('/myBlog/' + $scope.myBlog.email, $scope.myBlog).success(function(response) {
            console.log(response);
            toastr.success('Post deleted successfully.');
            $('#deletePostConfirmation').modal('hide');
            $scope.fetchBlogData();
        })
    };

    $scope.editPost = function(postDetail){
        $window.localStorage.setItem('editPost', JSON.stringify(postDetail));
        $state.go("editPost");
    };


    $scope.init();


}]);