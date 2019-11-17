angular.module('app').directive('messageItem', function(MessageService) {
  return {
    restrict: "E",
    templateUrl: 'app/custom/pubNubIntegration/components/message-item/message-item.html',
    scope: {
      senderUuid: "@",
      content: "=",
      date: "@"
    },
    controller:function($scope,$rootScope,$window){
      var counter = 1;
     /* $scope.tabs = [];
      $rootScope.tabs = $scope.tabs;*/
      $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
      $scope.fullName = $scope.userLocalStorage.fullName;
      $scope.userChannelName = $scope.userLocalStorage.email;
      var file = $scope.content.file;
      var img = new Image();   // Create new img element
      img.src = $scope.content.file;
      $scope.imagePath = img.src;
    }
  };
});

