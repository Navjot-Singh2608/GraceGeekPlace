angular.module('hireUser', [
    'ui.router',
    'toastr',
    'file-model',
    'ui.bootstrap'
])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) {

        $stateProvider
            .state('hireUser', {
                url: '/hireUser',
                cache: false,
                templateUrl: 'app/hireUser/views/hireUser.html',
                controller:'hireUserCtrl'
            });
        $locationProvider.html5Mode(true);
    });


