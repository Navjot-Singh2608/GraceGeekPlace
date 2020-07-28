angular.module('layout').controller('layoutCtrl', ['$scope', '$state', '$rootScope', 'profileService','$window', function ($scope, $state, $rootScope, profileService,$window) {


   /* dynamic height of the header*/
  /*  var dynamicHeaderHeight = document.getElementById('headerId').style.height;
    $rootScope.dynamicHeaderHeight = dynamicHeaderHeight;*/
    $scope.userPicName = "";
    $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
    $scope.userType = localStorage.getItem("userType");
    $scope.fullName = $scope.userLocalStorage.fullName;
    $scope.userEmailId = $scope.userLocalStorage.email;

    $scope.homePlaceholder = {};

   /* $scope.$watch("homePlaceholder.customSearch", function(newVal, oldVal) {
        if (newVal !== oldVal) {
           $rootScope.updateBlogs(newVal);
        }
    });*/



    $("#notification").hide();

    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    //fetch the user data
    $scope.fetchUserData = function () {
       if($scope.userEmailId){
           profileService.getUserData($scope.userEmailId).then(function (response) {
               if (response.data!=null) {
                   $rootScope.userID = response.data._id;
                   $scope.user = {
                       fullName: response.data.fullName,
                       email: response.data.email,
                       company: response.data.company,
                       experience: response.data.experience,
                       skills: response.data.skills,
                       userPicName: response.data.userPicName,
                       customImage: response.data.customImage,
                       _id:response.data._id
                   };
                   window.localStorage.setItem('userProfileStorage', JSON.stringify($scope.user));
               }
           });

       }

    };

    $scope.fetchUserData();



    $scope.groupPage = function(){
        $state.go("groups");
    };

    if($rootScope.user != undefined){
        $rootScope.userPicName = $rootScope.user.userPicName;
    }else{
        $rootScope.userPicName = '';
    }


    $scope.myProfileState = function () {
        $state.go("myProfile");
    };

    $scope.homeState = function(){
        $state.go("expert");
    };

    $scope.adminSpace = function(){

    }

    $rootScope.showCompilerNotification = function(messageContent){
        $scope.compilerMessage = messageContent.compilerMessage;
        $("#notification").show();
    };

    function closeMessage(el) {
        el.addClass('is-hidden');
    }

    $('.js-messageClose').on('click', function(e) {
        closeMessage($(this).closest('.Message'));
    });

    $('#js-helpMe').on('click', function(e) {
        alert('Help you we will, young padawan');
        closeMessage($(this).closest('.Message'));
    });

    $('#js-authMe').on('click', function(e) {
        alert('Okelidokeli, requesting data transfer.');
        closeMessage($(this).closest('.Message'));
    });

    $('#js-showMe').on('click', function(e) {
        alert("You're off to our help section. See you later!");
        closeMessage($(this).closest('.Message'));
    });

    $(document).ready(function() {
        setTimeout(function() {
            closeMessage($('#js-timer'));
        }, 5000);
    });













  /*  function closeMessage(el) {
        el.addClass('is-hidden');
    }

    $('.js-messageClose').on('click', function(e) {
        closeMessage($(this).closest('.Message'));
    });

    $('#js-helpMe').on('click', function(e) {
        alert('Help you we will, young padawan');
        closeMessage($(this).closest('.Message'));
    });

    $('#js-authMe').on('click', function(e) {
        alert('Okelidokeli, requesting data transfer.');
        closeMessage($(this).closest('.Message'));
    });

    $('#js-showMe').on('click', function(e) {
        alert("You're off to our help section. See you later!");
        closeMessage($(this).closest('.Message'));
    });

    $(document).ready(function() {
        setTimeout(function() {
            closeMessage($('#js-timer'));
        }, 5000);
    });*/

    $scope.closeNotification = function(){
        $("#notification").hide();
    };


    $scope.createBlogs = function(){
        alert("blogs")
        $state.go("myBlogs");
    }

    $scope.hireUser = function(){
        $state.go("hireUser");
    };


    $scope.hexToBase64 = function(str) {
        return str;
    };



}]);

