(function () {
'use strict';
angular.module('app', [
    'ui.router',
    'home',
    'myProfile',
    'expert',
    'groups',
    'layout',
    'askquestion',
    'myBlog',
    'myPosts',
    'editPost',
    'liveGroupChat',
    'hireUser',
    'blogList',
    'blogPost',
    'pubnub.angular.service',
    'ngNotify',
    'ui.bootstrap',
    'angular-multi-select',
    'ngStorage'
])


.controller('mainCtrl',['$scope','$state',function($scope,$state){
    $scope.askExpert = function(){
        $state.go("expert");
    }
}])


.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/home');
        $locationProvider.html5Mode(true);


})

/*function onLoadFunction(){
    gapi.client.setApiKey('AIzaSyCmdzCnPrdCe1FgCu4dpzr7QQ3ihRllnGg');
    gapi.client.load('plus','v1',function(){

    })
}*/


    window.fbAsyncInit = function() {
        FB.init({
            appId            : '821277524892285',
            autoLogAppEvents : true,
            xfbml            : true,
            version          : 'v3.2',
            status           : true
        });


        FB.getLoginStatus(function(response){
            if(response.status == 'connected'){
                // we are connected
            }else if(response.status == 'not_authorized'){
               // not auth
            }else{
                // wec are not logged in to facebook
            }
        });

    };

    /*(function(d,s,id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if(d.getElementById()){return;}
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js,fjs);
           }(document,'script','facebook-jssdk'))*/


})();







