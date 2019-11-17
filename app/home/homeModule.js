angular.module('home', [
    'ui.router',
    'toastr',
    'ui.bootstrap'
])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) {

        $stateProvider
            .state('home', {
                url: '/home',
                cache: false,
                templateUrl: 'app/home/views/home.html',
                controller:'homeCtrl'
            });
        /*$urlRouterProvider.otherwise("/");*/
        $locationProvider.html5Mode(true);
    });



