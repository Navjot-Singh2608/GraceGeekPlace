angular.module('app')
.factory('MessageService', ['$rootScope', '$q', 'Pubnub','currentUser', 'ngNotify','LiveUserRequest','$window','$localStorage',
 function MessageServiceFactory($rootScope, $q, Pubnub, currentUser, ngNotify,LiveUserRequest,$window,$localStorage) {
  
  // Aliasing this by self so we can access to this trough self in the inner functions
  var self = this;
  console.log(self);
  this.messages = [];
  var channelName = "";
  var requestUserSubscribeChannel="";
  var liveChatUserUniqueChannel = "";
  var checkDuplicateStatusMessageFlag = false;
   if($window.localStorage.getItem('userLocalStorage')){
       var userLocalStorage = JSON.parse($window.localStorage.getItem('userLocalStorage'));
       channelName = userLocalStorage.email;
   }
   if($rootScope.liveChatRequestedUserId){
       requestUserSubscribeChannel = $rootScope.liveChatRequestedUserId;
    }
   if($localStorage.liveChatUserUniqueChannel){
       liveChatUserUniqueChannel = $localStorage.liveChatUserUniqueChannel;
   }
  this.channel = channelName;

     var pubnubListener = new PubNub({
         publishKey : 'pub-c-eb607328-83ff-42f7-85a4-7fb6f5866dcc',
         subscribeKey : 'sub-c-01b9257c-c3c4-11e7-83f0-6e80f1f24680',
         ssl: true
     });

     pubnubListener.subscribe({
         channel : channelName,
         presence : function(m){
             console.log(m)
         },
         message : function(m){
             console.log(m)
         }
     });


  // We keep track of the timetoken of the first message of the array
  // so it will be easier to fetch the previous messages later
  this.firstMessageTimeToken = null;
  this.messagesAllFetched = false;
     
  var addChannel = function(){
      self.messages = [];
      populate();
      /*MessageServiceFactory($rootScope, $q, Pubnub, currentUser, ngNotify);*/
  };


   var whenDisconnected = function(){
      ngNotify.set('Connection lost. Trying to reconnect...', {
        type: 'warn',
        sticky: true,
        button: false
      });
  };

  var whenReconnected = function(){
      ngNotify.set('Connection re-established.', {
          type: 'info',
          duration: 1500
      });
  };

  var init = function() {

      Pubnub.subscribe({
          channel: channelName,
          disconnect : whenDisconnected,
          reconnect : whenReconnected,
          noheresync: true,
          triggerEvents: true,
          withPresence: true
      });
      /* subscibe the live Chat User unique Channel*/
      if(liveChatUserUniqueChannel) {
          Pubnub.subscribe({
              channel: liveChatUserUniqueChannel,
              disconnect: whenDisconnected,
              reconnect: whenReconnected,
              noheresync: true,
              triggerEvents: true
          });
      }
      if($rootScope.liveChatRequestedUserId) {
          Pubnub.subscribe({
              channel: requestUserSubscribeChannel,
              disconnect: whenDisconnected,
              reconnect: whenReconnected,
              noheresync: true,
              triggerEvents: true
          });
      }


      Pubnub.time(function(time){
        self.firstMessageTimeToken = time;
      });

      function checkLiveUserSynchronization(uniqueID){
          var secondPersonGroupSelected = JSON.parse($window.localStorage.getItem('secondPersonGroupSelected'));
          if(secondPersonGroupSelected){
              if(secondPersonGroupSelected.liveChatUserUniqueChannel == uniqueID){
                  return true;
              }else{
                  return false;
              }
          }
      }

      subcribeNewMessage(function(ngEvent,m){
         console.log("here is the new message");
         console.log(m);
         var compilerNotification = [];
        if(m.content.CompilerNotification){
            $rootScope.compilerNotificationCode(m.content);
            compilerNotification.push(m);
            $rootScope.getPageRefreshLiveUserData(compilerNotification);
            $rootScope.$apply();
        }else{
            var status = checkLiveUserSynchronization(m.content.liveChatUserUniqueChannel);
            if(status){
                self.messages.push(m);
                checkDuplicateStatusMessageFlag = true;
            }
            $rootScope.$apply();
            LiveUserRequest.getLiveUserRequest(m);
            $rootScope.getLiveChatUserRequest();
            $rootScope.$digest();
        }
  });

      /*----------------------------subcribe new live Chat User Unique Channel-----------------------------------------*/
      subcribeNewUserUniqueChannelwMessage(function(ngEvent,m){
          console.log("here is the new message");
          console.log(m);
          if(!checkDuplicateStatusMessageFlag){
              self.messages.push(m);
          }
          $rootScope.$apply();
          $rootScope.$digest()
      });
  };

     $rootScope.$on('liveUserRequestChannel', function(event, liveUserEmail){
         $localStorage.liveUserEmail= liveUserEmail;
         $localStorage.liveUserFlag= true;
         $rootScope.liveUserEmail = liveUserEmail;
         $rootScope.liveUserFlag = true;
     });

  var populate = function(liveChatUserUniqueChannel){
    var defaultMessagesNumber = 20;

       Pubnub.history({
           channel: liveChatUserUniqueChannel,
           callback: function(m){
               // Update the timetoken of the first message
               self.timeTokenFirstMessage = m[1];
               angular.extend(self.messages, m[0]);

               if(m[0].length < defaultMessagesNumber){
                   self.messagesAllFetched = true;
               }

               $rootScope.$digest();
               $rootScope.$emit('factory:message:populated')

           },
           count: defaultMessagesNumber,
           reverse: false,
           setChatBoxHeightId:$rootScope.setChatScreenHeight()

       });

  };

  ////////////////// PUBLIC API ////////////////////////

  var subcribeNewMessage = function(callback){
     $rootScope.$on(Pubnub.getMessageEventNameFor(channelName), callback);
  };

  /*----------------------------subcribe new live Chat User Unique Channel-----------------------------------------*/
 var subcribeNewUserUniqueChannelwMessage = function(callback){
     $rootScope.$on(Pubnub.getMessageEventNameFor(liveChatUserUniqueChannel), callback);
 };


  var fetchPreviousMessages = function(){
    var defaultMessagesNumber = 10;

    var deferred = $q.defer();

    Pubnub.history({
     channel: self.channel,
     callback: function(m){
        // Update the timetoken of the first message
        self.timeTokenFirstMessage = m[1];
        Array.prototype.unshift.apply(self.messages,m[0]);
        
        if(m[0].length < defaultMessagesNumber){
          self.messagesAllFetched = true;
        }

        $rootScope.$digest();
        deferred.resolve(m)

     },
     error: function(m){
        deferred.reject(m)
     },
     count: defaultMessagesNumber, 
     start: self.timeTokenFirstMessage,
     reverse: false
    });

    return deferred.promise
  };

   

  var getMessages = function(liveChatUserUniqueChannel) {
      self.messages = [];
    if (_.isEmpty(self.messages))
      populate(liveChatUserUniqueChannel);
    return self.messages;

  };

  var messagesAllFetched = function() {
    return self.messagesAllFetched;

  };


 var deleteMessages = function(messageContent,uuid,sender_uuid,date) {

         // Don't send an empty message
         if (_.isEmpty(messageContent))
             return;
         var channelName = '';
         if(messageContent.userRequest){
             /*In case of the user request*/
             channelName = channelName;
         }else{
             /*In case of the user response*/
             channelName = messageContent.userchannelName
         }

         Pubnub.publish({
             channel: channelName,
             message: {
                 message_id: messageContent.messageId,
                 channel: channelName,
                 user: messageContent.userName,
                 status: messageContent.messageContents,
                 usecase: "delete",
                 deleted: true
             }
         });
     };


     
     var sendMessage = function(messageContent) {
        var RequestSendchannelName = "";
        var liveChatUserUniqueChannel = "";
      // Don't send an empty message 
      if (_.isEmpty(messageContent))
          return;

      if(messageContent.CompilerNotification){

          Pubnub.publish({
              channel: messageContent.comppilerCodeReceiverChannelName,
              message: {
                  /*message_id: */
                  uuid: (Date.now() + currentUser),
                  message_id:messageContent.messageId,
                  content: messageContent,
                  usecase: "delete",
                  sender_uuid: currentUser,
                  date: Date.now()
              }
          });

      }else{
          if(messageContent.userRequest){
              /*In case of the user request*/
              RequestSendchannelName = messageContent.userchannelName;
              channelName = messageContent.sendRequestUserEmail;
              liveChatUserUniqueChannel = messageContent.liveChatUserUniqueChannel;
          }else{
              /*In case of the user response*/
              /*$rootScope.channelName = messageContent.userchannelName;*/
              RequestSendchannelName = messageContent.userchannelName;
          }

          Pubnub.publish({
              channel: RequestSendchannelName,
              message: {
                  /*message_id: */
                  uuid: (Date.now() + currentUser),
                  message_id:messageContent.messageId,
                  content: messageContent,
                  usecase: "delete",
                  sender_uuid: currentUser,
                  date: Date.now()
              }
          });
          Pubnub.publish({
              channel: channelName,
              message: {
                  /*message_id: */
                  uuid: (Date.now() + currentUser),
                  message_id:messageContent.messageId,
                  content: messageContent,
                  usecase: "delete",
                  sender_uuid: currentUser,
                  date: Date.now()
              }
          });
          /*------------------------------------------Publish on live Chat User Unique Channel---------------------------------------------*/
          Pubnub.publish({
              channel: liveChatUserUniqueChannel,
              message: {
                  /*message_id: */
                  uuid: (Date.now() + currentUser),
                  message_id:messageContent.messageId,
                  content: messageContent,
                  usecase: "delete",
                  sender_uuid: currentUser,
                  date: Date.now()
              }
          });
      }


  };


  init();


     Pubnub.init({
         publish_key: 'pub-c-eb607328-83ff-42f7-85a4-7fb6f5866dcc',
         subscribe_key: 'sub-c-01b9257c-c3c4-11e7-83f0-6e80f1f24680',
         uuid: currentUser,
         origin: 'pubsub.pubnub.com',
         ssl: true,
         heartbeat: 40,
         heartbeat_interval: 60
     });


   /*Fetch the user online and offline Status*/
     pubnubListener.addListener({
         presence: function(presenceEvent) {
             console.log('presence event came in: ', presenceEvent);
            /* alert(presenceEvent);*/
             $rootScope.$broadcast('liveUserPresenceStatus',presenceEvent);
             console.log("presenceEvent");
             console.log(presenceEvent);
         }
     });

   /*Subscribe to all the live user List Channels for presence purpose */
     var getLiveUserDetails = function(userChannels){
         pubnubListener.subscribe({ channels: userChannels,withPresence: true });
  };



  // The public API interface
  return {
    addChannel: addChannel,
    deleteMessages: deleteMessages,
    getMessages: getMessages, 
    sendMessage: sendMessage,
    subscribeNewMessage: subcribeNewMessage,
    fetchPreviousMessages: fetchPreviousMessages,
    messagesAllFetched : messagesAllFetched,
    getLiveUserDetails: getLiveUserDetails
  } 

}]);
