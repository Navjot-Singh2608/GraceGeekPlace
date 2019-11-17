
angular.module('editPost').controller('editBlogPostCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr', 'blogService','$window','profileService', function($scope, $rootScope, $state, $http, toastr, blogService,$window,profileService) {

    $scope.init = function(){
        $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        $scope.editBlogPost = JSON.parse($window.localStorage.getItem('editPost'));
        $scope.postNumber = $scope.editBlogPost.postNumber;
        $scope.fetchBlogData();
    };

    $scope.saveBlogPost = function(){
        var content =  CKEDITOR.instances['editor1'].getData();
        $scope.editBlogPost.postDetailDescription = content;
      /*  $scope.editBlogPost.postDetails.$scope.postNumber.postDetailDescription = content;*/
        $http.put('/myBlogPost/' + $scope.postNumber, $scope.editBlogPost).success(function(response) {
            console.log(response);
            toastr.success('Post created successfully.');
            $scope.fetchBlogData();

        })
    };

    $scope.fetchBlogData = function(){
        /* $scope.userProfileEmailId =  $window.localStorage.getItem('userProfileEmailId')*/
        $scope.postList = [];
        $scope.postNameList = [];
        if($scope.userLocalStorage.email){
            blogService.getBlogData($scope.postNumber).then(function (response) {
                if(response.data.blogName){
                    $scope.editBlogPost = response.data;

                }
            })
        }else{
            $scope.userFirstTimeBlogPostCreated = true;
        }
    };


    $scope.init();


}]);