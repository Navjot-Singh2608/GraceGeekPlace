
angular.module('blogPost').controller('blogPostCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr', 'blogService','$window','profileService','blogListService', function($scope, $rootScope, $state, $http, toastr, blogService,$window,profileService,blogListService) {


    $scope.blogPostData = $rootScope.blogPost;
    $scope.blogTextData = $rootScope.blogPost.postDetailDescription;

    $("#appendData").html($scope.blogTextData);
    /*$scope.blogTextData = $scope.blogTextData1.replace(/<[^>]*>/g, '');*/

    $scope.init = function(){

        $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        $scope.blogCategory = $window.localStorage.getItem('blogCategory');
        $scope.blogList = [];
     /*  $scope.fetchBlogList();*/
    };


   /* $scope.fetchBlogList = function(){
            blogListService.getAllBlogData().then(function (response) {
                angular.forEach(response.data[0].postDetails, function(blogObj,userKey) {
                    if(blogObj.languageUsed == $scope.blogCategory){
                        $scope.blogList.push(blogObj);
                    }
                });
               console.log(response);
            })
    };*/


   /* $scope.init();*/


}]);