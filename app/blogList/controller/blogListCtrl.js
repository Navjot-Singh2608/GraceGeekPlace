
angular.module('blogList').controller('blogListCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr', 'blogService','$window','profileService','blogListService', function($scope, $rootScope, $state, $http, toastr, blogService,$window,profileService,blogListService) {

    $scope.init = function(){

        $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        $scope.blogCategory = $window.localStorage.getItem('blogCategory');
        $scope.blogList = [];
       $scope.fetchBlogList();
    };


    setTimeout(function(){
        table = $('#dtBasicExample').DataTable({
            'destroy': true,
            'paging': true,
            'lengthChange': true,
            'searching': true,
            'ordering': true,
            "pageLength": 7,
            'info': true,
            'autoWidth': true
        });
        table = $('.dataTables_length').addClass('bs-select');
        $(".chatTabId").css({"padding-bottom": "2px","margin-bottom": "-20px","margin-top": "-3px"});
    }, 1000);


    $scope.fetchBlogList = function(){
            blogListService.getAllBlogData().then(function (response) {
                angular.forEach(response.data[0].postDetails, function(blogObj,userKey) {
                    angular.forEach(blogObj.languageUsed, function(blogObjLang,userKey) {
                        if(blogObjLang == $scope.blogCategory){
                            $scope.blogList.push(blogObj);
                        }
                    });
                });
               console.log(response);
            })
    };


    $scope.blogPost = function(blogPost){
        $rootScope.blogPost = blogPost;
        $state.go("blogPost");
    };




    $scope.init();


}]);