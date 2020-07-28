angular.module('askquestion').controller('questionCtrl',['$scope','$rootScope','$state','MessageService',
    'LiveUserRequest','$window','$localStorage',
    function ($scope,$rootScope,$state,MessageService,LiveUserRequest,$window,$localStorage){
    $scope.language = "Select Group";
    $scope.messagesend = '';
    $scope.selectGroupAskMode = true;
    $scope.liveUserRequestsMode = false;
   /* $scope.liveUserRequestList = [];*/
     $scope.liveUserRequestList = [];
     $scope.compilerNotificationList = [];
    $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
    $window.localStorage.setItem('stateObj', JSON.stringify($state.params.obj));
    $scope.stateObj = JSON.parse($window.localStorage.getItem('stateObj'));
    $scope.fullName = $scope.userLocalStorage.fullName;
    $scope.userChannelName = $scope.userLocalStorage.email;

  $scope.init = function(){
      $scope.userPrimaryChannelDetails();
       setTimeout(function(){
            $rootScope.$broadcast('pageRefreshLiveUserList', $scope.userChannelName);
       }, 500);


      /*call when it's not primary channel*/
      if(!$scope.userPrimaryChannelFlag){
         /* $rootScope.getLiveChatUserRequest();*/
          setTimeout(function(){   $scope.getUserDetails(); }, 1000);
      }
   };




    if($state.params.obj!=null){
        $scope.liveGroupChatSelectedUser = $state.params.obj;
    }
    $rootScope.changeChannel = $scope.userChannelName;
    $rootScope.channelName = $scope.userChannelName;
    $scope.names = ['java','android','Angularjs','C','C++'];



    $rootScope.setChatScreenHeight = function(){
        var windowHeight = $( window ).height();
        var headerHeight = $("#headerId").height();
        var footerHeight = $("#footerId").height();
        var chatBoxHeaderId = $("#chatBoxHeaderId").height();
        var chatBoxFooterId = $("#chatBoxFooterId").height();

        var chatBoxTextArea = windowHeight - (headerHeight+footerHeight+chatBoxHeaderId+chatBoxFooterId + 50);
        $("#chatBoxTextAreaId").css({"overflow-y": "scroll", "height": chatBoxTextArea + "px" });
    };


    $scope.messagestatus = function(){
      $scope.messageStatus = "fail";
    };

    $scope.selectedLanguage = function(language){
        $rootScope.language = language;
        $scope.messageStatus = "success";
        $rootScope.channelName = language;
        $rootScope.selectedLanguage = language;
        console.log(language);
    };


    /*Method to provide the answer to the required user in group chat*/
    $rootScope.provideAnswer = function(message,userData){
        var user = {};
        user.messageContent = message;
        user.userName = userData.content.userName;
        user.senderName = $rootScope.fullName;
        user.messageId = Math.floor(100000 + Math.random() * 900000);
        user.deleted = false;
        user.channelGroup = false;
        user.userRequest = false;
        user.userchannelName = userData.content.userchannelName;
        user.userPicName = $rootScope.userPicName;
        MessageService.sendMessage(user);
        $scope.user.messageContent = '';
    
    };


     $scope.userPrimaryChannelDetails = function(){
      $scope.userPrimaryChannel = JSON.parse($window.localStorage.getItem('userPrimaryChannel'));
      $scope.userPrimaryChannelFlag = JSON.parse($window.localStorage.getItem('userPrimaryChannelFlag'));
      if($scope.userPrimaryChannelFlag){
          $scope.pageType = $scope.userPrimaryChannel.pageType;
          $scope.userOwnStation = $scope.userPrimaryChannel.userOwnStation;
         /* setTimeout(function(){
              $rootScope.setChatScreenHeight();
          }, 500);*/
      }else{
          $scope.secondPersonGroupSelected = JSON.parse($window.localStorage.getItem('secondPersonGroupSelected'));
          $scope.pageType = $scope.secondPersonGroupSelected.pageType;
      }
     };





    $scope.checkPageType = function(){
        if($scope.pageType != 'group' && $scope.userOwnStation == false){
            return false;
        }else if ($scope.pageType == 'group' && $scope.userOwnStation == false){
            return false;
        }else{
            return true;
        }

    };

        /*$scope.checkPageType();*/

    $scope.userToggleSwitchForAskQuestionAndLiveUserRequest = function(askQuestionToGroup){
        if(askQuestionToGroup){
            /* runs when live Chat mode is selected*/
            $scope.selectGroupAskMode = false;
            $scope.liveUserRequestsMode = true;
            $localStorage.liveChatMode = true;
        }else{
           /* runs when group mode is selected*/
            $localStorage.liveChatMode = false;
            $scope.selectGroupAskMode = true;
            $scope.liveUserRequestsMode = false;
        }
    };


   /*---------------------------------get the live Chat user Request---------------------------------------------------*/

    $rootScope.getLiveChatUserRequest = function(){

        $scope.getLiveUserRequestList = LiveUserRequest.getLiveUserRequest();


        if($scope.getLiveUserRequestList.length!=0){


            angular.forEach($scope.getLiveUserRequestList, function(liveUserObj, key) {
                var userUniqueMailId = liveUserObj.liveRequestUserEmail;
                if(userUniqueMailId != $scope.userLocalStorage.email){

                   /* if($scope.liveUserRequestList.length == 0){
                        $scope.liveUserRequestList.push($scope.getLiveUserRequestList[0]);
                    }else */


                   if(userExists(userUniqueMailId)) {
                        angular.forEach($scope.liveUserRequestList, function(userObj, key){
                            if(userObj.liveRequestUserEmail == userUniqueMailId){
                                userObj.liveRequestUserRequestCount = liveUserObj.liveRequestUserRequestCount;
                                userObj.messageContent = liveUserObj.messageContent;
                            }
                        });
                    }else{
                       $scope.liveUserRequestList.push($scope.getLiveUserRequestList[0]);
                   }
                }
            });

        }
        };


    /*--------------------------------Accept Live User Request---------------------------------------------------------*/
    $scope.AcceptLiveUserRequest = function(acceptedUserDetail,activeUserClass){
            $scope.$broadcast('acceptUserChat', acceptedUserDetail);
            LiveUserRequest.setUserRequestObjCounterZero(acceptedUserDetail);
            $("." + activeUserClass).click(function () {
                $("." + activeUserClass).removeClass("activeLiveUserRequest z-depth-5");
                $(this).addClass("activeLiveUserRequest z-depth-5");
            });
            $window.localStorage.removeItem('secondPersonGroupSelected');
            var userDetail = {};
            userDetail.email =  acceptedUserDetail.liveRequestUserEmail;
            userDetail.fullName = acceptedUserDetail.liveRequestUserName;
            userDetail.userPicName = acceptedUserDetail.liveRequestUserPic;
            userDetail.userRequest = acceptedUserDetail.liveRequestUserRequest;
            userDetail.pageType = "user";
            userDetail.liveChatUserUniqueChannel = acceptedUserDetail.liveChatUserUniqueChannel;
            console.log(acceptedUserDetail);
            $window.localStorage.setItem('secondPersonGroupSelected', JSON.stringify(userDetail));
        };





    $scope.myProfile = function(){
        $state.go("myProfile");
    };


    $scope.getUserDetails = function(){
        var  userDetail =   JSON.parse($window.localStorage.getItem('secondPersonGroupSelected'));
       if($state.params.obj){
            var liveUserUniqueChannel = userDetail.liveChatUserUniqueChannel;
           /*********************Method call when user select user from online user group List**************************/
            $rootScope.$broadcast('liveUserFirstTimeRequest', liveUserUniqueChannel);

        }else{
           /*$scope.liveUserRequestList = [];*/

       }

    };

        $rootScope.getPageRefreshLiveUserData = function(liveRefreshUserList){
            angular.forEach(liveRefreshUserList, function(userObj, key) {
                var userRequestObj = {};
                var compilerNotificationObj = {};
                if(userObj.content.CompilerNotification == true){
                    compilerNotificationObj.compilerMessage =  userObj.content.compilerMessage;
                    compilerNotificationObj.compilerCodeSenderuserPicName =  userObj.content.compilerCodeSenderuserPicName;
                    compilerNotificationObj.compilerSourceCodeObj =  userObj.content.compilerSourceCodeObj;
                    compilerNotificationObj.comppilerCodeReceiverChannelName =  userObj.content.comppilerCodeReceiverChannelName;
                    compilerNotificationObj.CompilerNotification =  userObj.content.CompilerNotification;
                    compilerNotificationObj.uuid =  userObj.uuid;
                    $scope.compilerNotificationList.push(compilerNotificationObj);
                    userObj.content.sendRequestUserEmail = "";
                    $scope.$apply();
                }
                if(userObj.content.sendRequestUserEmail!=$scope.userChannelName && !userExists(userObj.content.sendRequestUserEmail) && userObj.content.CompilerNotification != true){
                    userRequestObj.liveRequestUserName = userObj.content.userName;
                    userRequestObj.liveRequestUserEmail = userObj.content.sendRequestUserEmail;
                    userRequestObj.liveRequestUserPic = userObj.content.userPicName;
                    userRequestObj.liveRequestUserRequest = userObj.content.userRequest;
                    userRequestObj.liveChatUserUniqueChannel = userObj.content.liveChatUserUniqueChannel;
                    userRequestObj.messageContent = userObj.content.messageContent;
                    userRequestObj.uuid = userObj.uuid;
                    $scope.liveUserRequestList.push(userRequestObj);
                    $scope.$apply();
                }

            });
        };

        $scope.showSenderCompilerCode = function(messageContent){
            document.getElementById("closeNotification").click();
            document.getElementById("showCompilerBtn").click();
            var html = ace.edit("htmleditor");
            var css = ace.edit("csseditor");
            var js = ace.edit("jseditor");
            html.getSession().setValue(messageContent.compilerSourceCodeObj.html);
            css.getSession().setValue(messageContent.compilerSourceCodeObj.css);
            js.getSession().setValue(messageContent.compilerSourceCodeObj.js);
        };


        function userExists(userUniqueMailId) {
            return $scope.liveUserRequestList.some(function(el) {
                return el.liveRequestUserEmail === userUniqueMailId;
            });
        }


        $scope.showCompilerModel = function(){
            $rootScope.$broadcast('datacompiler','data');
        };



        $scope.init();

}]);

angular.module('askquestion').filter('reverse', function() {
    return function(item) {
        if(item){
            return item.slice().reverse();
        }else{
            return item;
        }

    };
});




