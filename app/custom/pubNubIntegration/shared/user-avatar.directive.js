angular.module('app').directive('userAvatar', function() {
  return {
    restrict: "E",
    template: '<img  ng-if="content.userPicName" src="userProfileImage/{{content.userPicName}}" alt="{{uuid}}" class="circle image-border">' +
        '<img ng-if="!content.userPicName" src="../../img/avatar.png" class="avatar-img user-nav-image-border circle image-border" alt="View"/>',
    scope: {
      uuid: "@",
      content: "="
    },
    controller: function($scope){
      // Generating a uniq avatar for the given uniq string provided using robohash.org service
     /* $scope.userPicName = $scope.content.userPicName;*/
      $scope.avatarUrl = '//robohash.org/' + $scope.uuid + '?set=set2&bgset=bg2&size=70x70';
}
};
});