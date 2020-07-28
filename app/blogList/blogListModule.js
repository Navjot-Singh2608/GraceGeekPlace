angular.module('blogList', [
    'ui.router',
    'toastr',
    'file-model',
    'ui.bootstrap'
])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) {

        $stateProvider
            .state('blogList', {
                url: '/blogList',
                cache: false,
                templateUrl: 'app/blogList/views/blogList.html'
            });
        $locationProvider.html5Mode(true);
    });


