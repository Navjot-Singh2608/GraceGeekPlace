angular.module('blogPost', [
    'ui.router',
    'toastr',
    'file-model',
    'ui.bootstrap'
])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) {

        $stateProvider
            .state('blogPost', {
                url: '/blogPost',
                cache: false,
                templateUrl: 'app/blogPost/views/blogPost.html',
                controller:'blogPostCtrl'
            });
        $locationProvider.html5Mode(true);
    });


