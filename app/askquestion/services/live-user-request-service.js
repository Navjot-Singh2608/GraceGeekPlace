angular.module('app')
    .factory('LiveUserRequest', ['$rootScope', '$q',
        function LiveUserServiceFactory($rootScope, $q) {

         var liveUserRequest = [];




            var getLiveUserRequest = function(userRequest) {
               /* var deferred = $q.defer();*/
                var userAlreadyExist = false;
                if(userRequest){
                    var userRequestObj = {};
                    userRequestObj.liveRequestUserName = userRequest.content.userName;
                    userRequestObj.liveRequestUserEmail = userRequest.content.sendRequestUserEmail;
                    userRequestObj.liveRequestUserPic = userRequest.content.userPicName;
                    userRequestObj.liveRequestUserRequest = userRequest.content.userRequest;
                    userRequestObj.liveChatUserUniqueChannel = userRequest.content.liveChatUserUniqueChannel;
                    userRequestObj.messageContent = userRequest.content.messageContent;
                    userRequestObj.uuid = userRequest.uuid;
                    userRequestObj.liveRequestUserRequestCount = 1;
                    if(liveUserRequest.length == 0){
                        liveUserRequest.push(userRequestObj);
                    }else{
                        angular.forEach(liveUserRequest, function(liveUserRequestObj, key){
                            if(liveUserRequest[key].liveRequestUserEmail == userRequest.content.sendRequestUserEmail){
                                liveUserRequest[key].liveRequestUserRequestCount++;
                                liveUserRequest[key].messageContent = userRequestObj.messageContent;
                                userAlreadyExist = true;
                                return liveUserRequest;
                            }
                        });
                        if(!userAlreadyExist){
                            liveUserRequest.push(userRequestObj);
                        }
                    }
                }else{
                    return liveUserRequest;
                }
            };


            var setUserRequestObjCounterZero = function(acceptedUserDetail) {
                angular.forEach(liveUserRequest, function(liveUserRequestObj, key){
                    if(liveUserRequestObj.liveRequestUserEmail == acceptedUserDetail.liveRequestUserEmail){
                        liveUserRequestObj.liveRequestUserRequestCount = 0;
                    }
                });
                $rootScope.getLiveChatUserRequest();
            };


            return {

                getLiveUserRequest: getLiveUserRequest,
                setUserRequestObjCounterZero:setUserRequestObjCounterZero
               /* sendMessage: sendMessage*/
            }

        }]);
