angular.module('myPosts', [
    'ui.router',
    'toastr',
    'file-model',
    'ui.bootstrap'
])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) {

        $stateProvider
            .state('myPosts', {
                url: '/myPosts',
                cache: false,
                templateUrl: 'app/posts/views/myPosts.html',
                controller:'postsCtrl'
            });
        $locationProvider.html5Mode(true);
    });


