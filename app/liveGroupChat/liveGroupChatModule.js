angular.module('liveGroupChat', [
    'ui.router',
    'toastr',
    'ui.bootstrap'
])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) {

        $stateProvider
            .state('liveGroupChat', {
                url: '/liveGroupChat',
                params: {
                    obj: null
                },
                templateUrl: 'app/liveGroupChat/views/liveGroupChat.html',
                controller:'liveGroupChatCtrl'
            });
        $locationProvider.html5Mode(true);
    });



