
angular.module('blogPost').controller('blogPostCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr',
    'blogService','$window','profileService','blogListService', function($scope, $rootScope, $state, $http, toastr,
                                                                         blogService,$window,profileService,blogListService) {


    $scope.postkey = $rootScope.postkey;


   // $scope.blogTextData = $rootScope.blogPost.postDetailDescription;

    /*$("#appendData").html($scope.blogTextData);*/





  //  $('#appendData').append($scope.blogTextData);

  //  $( "#appendData:has(p)" ).addClass( "textAlignLeft" );

    /*$("#appendData>p").each(function(i){
        i.style.textAlign = "left";
    });
*/

    /*$scope.blogTextData = $scope.blogTextData1.replace(/<[^>]*>/g, '');*/

    $scope.init = function(){


       /* $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        $scope.blogCategory = $window.localStorage.getItem('blogCategory');
        $scope.blogList = [];*/

       $scope.fetchBlogData($scope.postkey);
    };


    $scope.fetchBlogData = function(postKey){
            blogListService.fetchBlogData(postKey).then(function (response) {
               console.log(response);
                var cloudPostDetailKey = response.data[0]._id.BlogDetail.postDetailDescription;
                if(cloudPostDetailKey){
                    $scope.getPostDetailDescription(cloudPostDetailKey);
                }

            });
    };


        $scope.getPostDetailDescription = function(id){
            $http.get('/getpostdetaildescription',{params: {id: id}}).then(function(response) {
                console.log("cloud data");
                console.log(response);
                $('#appendData').append((JSON.parse(response.data)));
                $('#custom-textarea').textpager({
                    controlArrows: ".custom-control",
                    controlPages: ".custom-control .custom-pages",
                    controlPagesContent: "li"
                });
                $('.custom-pages li').hide().slice(0, 4).show();
                $(".custom-pages li").slice(-3).show();
               /* $(".custom-pages li:nth-child(1)").after('<li><a><span class="tab">Message Center</span></a></li>');*/
                $('.custom-pages li:eq(3)').after('<li class="tp-page" style="display: list-item;"> - </li>');
            });
        };



        $scope.init();


}]);