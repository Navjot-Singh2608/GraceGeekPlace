
angular.module('blogList').controller('blogListCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr',
    'blogService','$window','profileService','blogListService', function($scope, $rootScope, $state, $http,
        toastr, blogService,$window,profileService,blogListService) {

    $scope.init = function(){

        $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        $scope.blogCategory = $window.localStorage.getItem('blogCategory');
        $scope.blogList = [];
       $scope.fetchBlogList($scope.blogCategory);
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


    $scope.fetchBlogList = function(langSelected){
            blogListService.getLangBlogAllData(langSelected).then(function (response) {
                var postDetailData = response.data;
                angular.forEach(postDetailData, function(blogObj,userKey) {
                    var cusBlogObj = {
                        fullName:blogObj.userDetail[0].fullName,
                        country:blogObj.userDetail[0].country,
                        state:blogObj.userDetail[0].state,
                        customImage:blogObj.userDetail[0].customImage,
                        skills:blogObj.userDetail[0].skills,
                        postName:blogObj._id.BlogDetail.postName,
                        postDescription:blogObj._id.BlogDetail.postDescription,
                        postkey:blogObj._id.BlogDetail.postKey
                    };
                    $scope.blogList.push(cusBlogObj);
                });
               console.log(response);
            });

    };



    $scope.blogPost = function(postkey){
        $rootScope.postkey = postkey;
        $state.go("blogPost");
    };

        $scope.hexToBase64 = function(str) {
            return str;
        }



    $scope.init();


}]);