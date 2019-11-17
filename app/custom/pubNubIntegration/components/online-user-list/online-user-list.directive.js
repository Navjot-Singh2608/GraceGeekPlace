angular.module('app').directive('onlineUserList', function($rootScope, UserService) {
  return {
    restrict: "EA",
    replace: true,
    templateUrl: 'app/custom/pubNubIntegration/components/online-user-list/online-user-list.html',
    link: function(scope, element, attrs, basketCtrl) {

    },
    controller: function($scope,$rootScope){
      $scope.tabs = $rootScope.tabs;
      $scope.users = UserService.getOnlineUsers();
      console.log("Here we are");

     $scope.showCompilerModel = function(){
       $rootScope.$broadcast('datacompiler','data')
     };



    }
  };
});