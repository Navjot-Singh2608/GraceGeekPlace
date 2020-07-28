angular.module('app').directive('messageList', function ($rootScope, $anchorScroll, MessageService, ngNotify, UserService) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: 'app/custom/pubNubIntegration/components/message-list/message-list.html',

        link: function (scope, element, attrs, ctrl) {
            scope.$watchCollection("channelChange", function (newArray) {
                UserService.addChannel(scope.$root.changeChannel)
                MessageService.addChannel(scope.$root.changeChannel);
                alert("back");
                init();

                /*fetch all user details according to the requested live user selected*/
               function getAcceptedUserChat(acceptedUserDetail){
                   var loadMessages = [];
                    scope.messages = [];

                    console.log(acceptedUserDetail);
                    scope.messages = MessageService.getMessages(acceptedUserDetail.liveChatUserUniqueChannel);
                  /*  angular.forEach(scope.allUsersMessages, function(userObj, key) {
                        if(acceptedUserDetail.liveRequestUserEmail == userObj.content.sendRequestUserEmail){
                            scope.messages.push(userObj);
                        }
                    });*/
                   /* scope.$apply();*/
                    $rootScope.$broadcast('liveUserRequestChannel', acceptedUserDetail.liveRequestUserEmail);
                }

               function addNewRequestedUser(newUserDetail){
                    angular.forEach(scope.allUsersMessages, function(userObj, key) {
                        if(newUserDetail.content.sendRequestUserEmail == userObj.content.sendRequestUserEmail){
                            scope.messages.push(userObj);
                        }
                    });
                }



               $rootScope.$on('pageRefreshLiveUserList', function(event, userChannel){
                    scope.liveUserRequestMessage = [];
                    scope.liveUserRequestMessage = MessageService.getMessages(userChannel);
                    setTimeout(function(){
                        $rootScope.getPageRefreshLiveUserData( scope.liveUserRequestMessage);
                    }, 1000);
                });

                $rootScope.$on('addNewRequestedUser', function(event, newUserDetail){
                    addNewRequestedUser(newUserDetail);
                });

                scope.$on('acceptUserChat', function(event, acceptedUserDetail){
                    getAcceptedUserChat(acceptedUserDetail);
                    scope.acceptedUserDetail = acceptedUserDetail;
                });
                scope.$on('acceptUserChat', function(event, acceptedUserDetail){
                   /* getAcceptedUserChat(acceptedUserDetail);*/
                    $rootScope.liveChatRequestedUserId = acceptedUserDetail.liveRequestUserEmail;
                    scope.messages = MessageService.getMessages(acceptedUserDetail.liveChatUserUniqueChannel);
                });

                /*----------------------First Time Request for live group User List User-----------------------------------*/
               $rootScope.$on('liveUserFirstTimeRequest', function(event, liveUserUniqueChannel){
                       scope.messages = MessageService.getMessages(liveUserUniqueChannel);

                });
                console.log(scope.messages);
            });

            scope.provideAnswer = function (message, userData) {
                $rootScope.provideAnswer(message, userData);
            };

            var element = angular.element(element);

            var scrollToBottom = function () {
                element.scrollTop(element.prop('scrollHeight'));
            };

            var hasScrollReachedBottom = function () {
                return element.scrollTop() + element.innerHeight() >= element.prop('scrollHeight')
            };

            var hasScrollReachedTop = function () {
                return element.scrollTop() === 0;
            };

            var fetchPreviousMessages = function () {

                ngNotify.set('Loading previous messages...', 'success');

                var currentMessage = MessageService.getMessages()[0].uuid

                MessageService.fetchPreviousMessages().then(function (m) {

                    // Scroll to the previous message
                    $anchorScroll(currentMessage);

                });

            };

            var watchScroll = function () {

                if (hasScrollReachedTop()) {

                    if (MessageService.messagesAllFetched()) {
                        ngNotify.set('All the messages have been loaded', 'grimace');
                    }
                    else {
                        fetchPreviousMessages();
                    }
                }

                // Update the autoScrollDown value
                scope.autoScrollDown = hasScrollReachedBottom()

            };

            var init = function () {

                // Scroll down when the list is populated
                var unregister = $rootScope.$on('factory:message:populated', function () {
                    // Defer the call of scrollToBottom is useful to ensure the DOM elements have been loaded
                    _.defer(scrollToBottom);
                    unregister();

                });

                // Scroll down when new message
                MessageService.subscribeNewMessage(function () {
                    if (scope.autoScrollDown) {
                        scrollToBottom()

                    }

                });

                // Watch the scroll and trigger actions
                element.bind("scroll", _.debounce(watchScroll, 250));
            };

            init();

        },
        controller: function ($scope,$rootScope,$window) {
            // Auto scroll down is acticated when first loaded
           /* $scope.pageType = $rootScope.pageType;*/
            $scope.userPrimaryChannelDetails = function(){
                $scope.userPrimaryChannel = JSON.parse($window.localStorage.getItem('userPrimaryChannel'));
                $scope.userPrimaryChannelFlag = JSON.parse($window.localStorage.getItem('userPrimaryChannelFlag'));
                if($scope.userPrimaryChannelFlag){
                    $scope.pageType = $scope.userPrimaryChannel.pageType;
                    $scope.channelGroup = $scope.userPrimaryChannel.channelGroup;
                    $scope.userOwnStation = $scope.userPrimaryChannel.userOwnStation;
                }

            };
            $scope.userPrimaryChannelDetails();
            $scope.autoScrollDown = true;
           /* $scope.messages = MessageService.getMessages();*/
            $scope.provideAnswerToggleBar = false;
            $rootScope.openProvideAnswerEditText = function(id){
                var cols = document.getElementsByClassName('provideAnswerToggleBar');
                for(var i=0; i<cols.length; i++) {
                    cols[i].style.visibility = 'visible';
                }
            };
        }
    };
});