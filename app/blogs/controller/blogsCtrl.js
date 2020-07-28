'use strict';
angular.module('myBlog').controller('blogsCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr', 'blogService','$window', function($scope, $rootScope, $state, $http, toastr, blogService,$window) {

    $(document).ready(function(){
        $(this).scrollTop(0);
    });


     $scope.init = function(){

         $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
         $scope.userFirstTimeBlogCreated = true;
         $scope.myBlog = {};
         $scope.myBlog.email = $scope.userLocalStorage.email;
         $scope.fetchBlogData();

     };




    $scope.createBlog = function(){
        if($scope.userFirstTimeBlogCreated) {
            $http.post('/myBlog', $scope.myBlog).success(function (response) {
                console.log(response);
                toastr.success('Blog created successfully.');
              /*  $scope.userProfileEmailId = $scope.user.email;
                $("#updateBlog").show();
                $("#createBlog").hide();
                $("#createPosts").show();*/
                $window.localStorage.setItem('myBlog', JSON.stringify($scope.myBlog));
                $scope.userFirstTimeBlogCreated = false;
            })
        }
        else{
            $http.put('/myBlog/' + $scope.userLocalStorage.email, $scope.myBlog).success(function(response) {
                    console.log(response);
                    $window.localStorage.setItem('myBlog', JSON.stringify($scope.myBlog));
                    $scope.userFirstTimeBlogCreated = false;
                    toastr.success('Blog updated successfully.');
                })
            }
        };

    /*Update Function of the Blog*/
    $scope.updateBlog = function(){

       if($scope.myBlog.blogName===undefined || $scope.myBlog.blogDescription === undefined){
           toastr.success('Please Fill the Blog name and Blog Description');
       }else{
           $scope.createBlog();
       }






    }



    $scope.fetchBlogData = function(){
        /* $scope.userProfileEmailId =  $window.localStorage.getItem('userProfileEmailId')*/
        if($scope.userLocalStorage.email){
            blogService.getBlogData($scope.userLocalStorage.email).then(function (response) {
               if(response.data.blogName){
                   $scope.myBlog = response.data;
                   var myBlog = {};
                   myBlog.email = $scope.myBlog.email;
                   myBlog.blogName = $scope.myBlog.blogName;
                   myBlog.blogDescription = $scope.myBlog.blogDescription;
                   $window.localStorage.setItem('myBlog', JSON.stringify(myBlog));
                   $scope.userFirstTimeBlogCreated = false;
               }
            })
        }else{
            $scope.userFirstTimeBlogCreated = true;
        }
    };


    $scope.createPosts = function(){
        $state.go("myPosts");
    };




    $scope.init();

}]);