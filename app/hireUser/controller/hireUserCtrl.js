
angular.module('hireUser').controller('hireUserCtrl', ['$scope', '$rootScope', '$state', '$http', 'toastr', 'blogService','$window','profileService','MessageService','hireUserService', function($scope, $rootScope, $state, $http, toastr, blogService,$window,profileService,MessageService,hireUserService) {

    $scope.init = function(){
        var table;

        if($state.params.obj!=null){
            var liveGroupChatGroup = $state.params.obj.groupType;
        }
        $scope.userProfileDetails = [];
        var userProfileChannels = [];
        $scope.getAllFreelancerData();
    };


    /*------------------------------fetch user details------------------------------------*/
    $scope.fetchUserData = function () {
        var id = "";
        if($rootScope.userChannelName){
            id = $rootScope.userChannelName;
        }else{
            id =  $scope.userLocalStorage.userData.email;
        }
        profileService.getUserData(id).then(function (response) {
            if (response.data!=null) {
                $rootScope.userID = response.data._id;
                $rootScope.user = {
                    fullName: response.data.fullName,
                    email: response.data.email,
                    company: response.data.company,
                    experience: response.data.experience,
                    skills: response.data.skills,
                    userPicName: response.data.userPicName,
                    skillsQuotes: response.data.skillsQuotes,
                    _id:response.data._id
                };
                $scope.user = $rootScope.user;
            }
        })


    };

    $scope.usersData = [1, 2, 3, 4, 5, 30, 31];
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


   /*****************************get User Profile data***********************************************/

    $scope.getAllFreelancerData = function(){
        $scope.userProfileDetails = [];
        hireUserService.getAllFreelancerDetails().then(function (response) {
           console.log(response.data);
            $scope.userProfileDetails = response.data;
      });
    };

    $scope.getAllStudentData = function(){
        $scope.userProfileDetails = [];
        hireUserService.getAllStudentDetails().then(function (response) {
            console.log(response.data);
            $scope.userProfileDetails = response.data;
        });
    };

    $scope.getAllTeacherData = function(){
        $scope.userProfileDetails = [];
        hireUserService.getAllTeacherDetails().then(function (response) {
            console.log(response.data);
            $scope.userProfileDetails = response.data;
        });
    };
    $scope.getAllEmployerData = function(){
        hireUserService.getAllEmployerDetails().then(function (response) {
            console.log();
            $scope.userProfileDetails = response.data;
        });
    };

    /*---------------------------------------------Live User Chat--------------------------------------------------------------------*/

    $scope.liveUserChat = function(userDetail) {
        $localStorage.liveChatMode = true;
        $scope.liveChatUserUniqueChannel = "";
        $localStorage.liveChatUserUniqueChannel = "";
        $scope.generateLiveChatUserUniqueChannel(userDetail);
        userDetail.userRequest = true;
        userDetail.pageType = "user";
        userDetail.liveChatUserUniqueChannel = $scope.liveChatUserUniqueChannel;
        $window.localStorage.setItem('secondPersonGroupSelected', JSON.stringify(userDetail));
        $window.localStorage.setItem('userPrimaryChannelFlag', 'false');
        var userName = userDetail.fullName;
        $rootScope.language = userDetail.email;
        $rootScope.user = userDetail;
        $rootScope.pageType = "user";
        $rootScope.userOwnStation = false;
        $rootScope.channelName = $rootScope.userChannelName;
        $rootScope.channelGroup = false;
        $rootScope.userRequest = true;
        userDetail.liveGroupChannel = true;
        $state.go("askquestion",{obj: userDetail});
    };


    $scope.generateLiveChatUserUniqueChannel = function(userDetail){
        $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
        var firstUser = $scope.userLocalStorage.email.substr(0, $scope.userLocalStorage.email.indexOf('@'));
        var secondUser = userDetail.email.substr(0, userDetail.email.indexOf('@'));
        $scope.liveChatUserUniqueChannel =  firstUser.trim() + secondUser.trim();
        $localStorage.liveChatUserUniqueChannel = $scope.liveChatUserUniqueChannel;

    };

    /*Fetch the user online and offline Status */
    $scope.$on('liveUserPresenceStatus', function(event, presenceEvent){
        angular.forEach($scope.userProfileDetails, function(userObj, key) {
            if(presenceEvent.channel == userObj.email){
                userObj.action = presenceEvent.action;
            }
            $scope.$apply();
        });
    });

  $scope.init();

}]);