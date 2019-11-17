angular.module('app').directive('messageForm', function() {
  return {
    restrict: "E",
    replace: true,
    templateUrl: 'app/custom/pubNubIntegration/components/message-form/message-form.html',
    scope: {
      language:'@',
      messagetext:'@',
      messagesend:'=',
      messagestatus:'&'
    },
    controller: function($scope, currentUser, MessageService,$rootScope,$window,$localStorage){

      $scope.userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
      $scope.userProfileStorage = JSON.parse($window.localStorage.getItem('userProfileStorage'));

      $scope.init = function(){
        $scope.userPrimaryChannelDetails();
      };



      $scope.userPrimaryChannelDetails = function(){
        $scope.userPrimaryChannel = JSON.parse($window.localStorage.getItem('userPrimaryChannel'));
        $scope.userPrimaryChannelFlag = JSON.parse($window.localStorage.getItem('userPrimaryChannelFlag'));
        if($scope.userPrimaryChannelFlag){
          $scope.pageType = $scope.userPrimaryChannel.pageType;
          $scope.channelGroup = $scope.userPrimaryChannel.channelGroup;
          $scope.userOwnStation = $scope.userPrimaryChannel.userOwnStation;
        }else{
          $scope.secondPersonGroupSelected = JSON.parse($window.localStorage.getItem('secondPersonGroupSelected'));
          $scope.pageType = $scope.secondPersonGroupSelected.pageType;
        }
      };



     /* $scope.pageType = $rootScope.pageType;*/
      $scope.uuid = currentUser;
      $scope.messageContent = '';
      $scope.message = {};
      $scope.secondPersonRequestDetail = {};
    /*  $scope.channelGroup = $rootScope.channelGroup;*/
      /*clear user chat*/
      $scope.clearChat = function(){
        console.log("clear user chat");
        var userChat = MessageService.getMessages();
        angular.forEach(userChat, function(value, key) {
          value.content.deleted = true;
          MessageService.deleteMessages(value.content,value.uuid,value.sender_uuid,value.date);
        });
       
      };


      $scope.getSecondPersonGroupData = function(){
        $scope.secondPersonGroupSelected = JSON.parse($window.localStorage.getItem('secondPersonGroupSelected'));
        if($scope.secondPersonGroupSelected && !$scope.userPrimaryChannelFlag){
          $scope.pageType = $scope.secondPersonGroupSelected.pageType;
          $scope.secondPersonRequestDetail.email = $scope.secondPersonGroupSelected.email;
          $scope.secondPersonRequestDetail.userRequest = $scope.secondPersonGroupSelected.userRequest;
          $scope.secondPersonRequestDetail.userPicName = $scope.secondPersonGroupSelected.userPicName;
          $scope.secondPersonRequestDetail.liveChatUserUniqueChannel = $scope.secondPersonGroupSelected.liveChatUserUniqueChannel;
        }
      };
      /*$scope.getSecondPersonGroupData();*/



      $scope.sendMessage = function(messageContent){
       /* chatBoxTextAreaId*/
         $scope.messageContent = $scope.message.content;
         if($localStorage.liveChatMode){  //This Block of code is for live user Chat
           $window.localStorage.setItem('userPrimaryChannelFlag', 'false');
           $scope.userPrimaryChannelFlag = JSON.parse($window.localStorage.getItem('userPrimaryChannelFlag'));
           $scope.getSecondPersonGroupData();
           $scope.user = {};
           $scope.user.messageContent = $scope.messageContent;
           $scope.user.messageId = Math.floor(100000 + Math.random() * 900000);
           $scope.user.userName = $scope.userLocalStorage.fullName;
           $scope.user.sendRequestUserEmail = $scope.userLocalStorage.email;
           $scope.user.channelGroup = false;
           $scope.user.userchannelName = $scope.secondPersonRequestDetail.email;
           $scope.user.userRequest = $scope.secondPersonRequestDetail.userRequest;
           if($scope.userProfileStorage!=null){
             $scope.user.userPicName = $scope.userProfileStorage.userPicName;
           }
           $scope.user.liveChatUserUniqueChannel = $scope.secondPersonRequestDetail.liveChatUserUniqueChannel;
           $scope.user.prodEdtToggle = '';
           $scope.user.file = $scope.file;
           MessageService.sendMessage($scope.user);
           $scope.messageContent = '';
           $scope.messagesend = "success";
         }
       else{ //This Block of code is for group Chat user
         if($rootScope.language == "Select Language" || $rootScope.language == undefined){
           $scope.messagesend= "fail";
           $scope.messagestatus()
         }else{
           $scope.user = {};
           $scope.user.messageContent = $scope.messageContent;
           $scope.user.messageId = Math.floor(100000 + Math.random() * 900000);
           $scope.user.userName = $scope.userLocalStorage.fullName;
           $scope.user.sendRequestUserEmail = $scope.userLocalStorage.email;
           $scope.user.channelGroup = true;
           $scope.user.userchannelName = $scope.secondPersonRequestDetail.email;
           $scope.user.userRequest = $scope.secondPersonRequestDetail.userRequest;
           $scope.user.userPicName = $scope.userProfileStorage.userPicName;
           $scope.user.liveChatUserUniqueChannel = $scope.secondPersonRequestDetail.liveChatUserUniqueChannel;
           $scope.user.prodEdtToggle = '';
           $scope.user.file = $scope.file;
           MessageService.sendMessage($scope.user);
           $scope.messageContent = '';
           $scope.messagesend = "success";
         }
        }
      };


      function readURL(input) {
        if (input.files && input.files[0]) {
          $scope.file = input.files[0];
          $scope.fileName = $scope.file.name;
          getBase64($scope.file);
        }
      }




      function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          $scope.file = reader.result;
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      }

      angular.element("#imgInp").change(function() {
        readURL(this);
      });





      setTimeout(function(){

        $( document ).ready(function() {
          $(function() {
            // Initializes and creates emoji set from sprite sheet
            window.emojiPicker = new EmojiPicker({
              emojiable_selector: '[data-emojiable=true]',
              assetsPath: '../../../../../plugins/emoji/img/',
              popupButtonClasses: 'fa fa-smile-o'
            });
            // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
            // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
            // It can be called as many times as necessary; previously converted input fields will not be converted again
            window.emojiPicker.discover();
          });
        });


        // Google Analytics
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-49610253-3', 'auto');
        ga('send', 'pageview');
        $('.emojiPicker').css({left: left + 'px', top: (top - 1960) + 'px'});
      }, 10);

      $scope.init();

    }
  };
});