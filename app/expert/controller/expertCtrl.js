angular.module('expert')
    .controller('expertCtrl', ['$scope','$state','$rootScope','$window','$http','$filter',
        function($scope,$state,$rootScope,$window,$http,$filter){



        $scope.currentState = $state.current.name;
        $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        $scope.fullName = $scope.userLocalStorage.fullName;
        $scope.userChannelName = $scope.userLocalStorage.email;
        $scope.changeChannel = '';

       /* $window.localStorage.setItem('userLocalStorage', JSON.stringify($scope.user));*/

        console.log($scope.userLocalStorage);

           /* $rootScope.updateBlogs = function(newVal){
                $scope.randomData = $scope.expertBlog
                $scope.expertBlog = $filter('searchKeys')($scope.randomData,newVal);

            };*/




        $scope.pageAskQuestion = function(selectedTopic){
        $rootScope.pageType = "group";
        $rootScope.userOwnStation = false;
        $rootScope.channelGroup = true;
        $rootScope.channelName = selectedTopic;
        $state.go("askquestion",{reload: true});
    };




         $scope.init = function(){
            $scope.getExpertBlog();

       }

    /*$scope.$watch('channelName', function() {
        MessageService.channel = $rootScope.channelName ;
    });*/

    $scope.userChannel = function () {
        var userPrimaryChannel = {};

        var userName = $scope.userChannelName;
        $rootScope.pageType = "user";
        $rootScope.userOwnStation = true;
        $rootScope.channelName = userName;
        $rootScope.channelGroup = false;
        $rootScope.userRequest = true;
        userPrimaryChannel.pageType = "user";
        userPrimaryChannel.userOwnStation = true;
        userPrimaryChannel.channelName = $scope.userChannelName;
        userPrimaryChannel.channelGroup = false;
        userPrimaryChannel.userRequest = true;
        $window.localStorage.setItem('userPrimaryChannel', JSON.stringify(userPrimaryChannel));
        $window.localStorage.setItem('userPrimaryChannelFlag', 'true');
        $state.go("askquestion",{reload: true});
    };

    $scope.liveGroupChatPage = function(liveGroupChatType){
        var liveGroupChatTypeObj  = {};
        liveGroupChatTypeObj.groupType = liveGroupChatType;
        $window.localStorage.setItem('liveGroupChatType', liveGroupChatType);
        $state.go("liveGroupChat",{obj: liveGroupChatTypeObj});
    };

      /*  $window.location.reload();*/


   $scope.blogList = function(blogCategory){
       $window.localStorage.setItem('blogCategory', blogCategory);
       $state.go("blogList");
   }

    $scope.getExpertBlog = function(){
        $http.get('json/expertPageBlogs.json').then(function(response) {
            $scope.expertBlog = response.data;
        });

    };


   $scope.init();

    }]);

angular.module('expert').filter('searchKeys', function() {
    return function(items, search) {
        var filtered = [];
        if (search) {
            angular.forEach(items, function(item) {
                if (item.title.match("^" + search, "i")) {
                    filtered.push(item);
                }
            });
        }else{
            filtered=items;
        }
        return filtered;
    }
})

