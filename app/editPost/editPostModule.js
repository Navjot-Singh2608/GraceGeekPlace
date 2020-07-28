angular.module('editPost', [
    'ui.router',
    'toastr',
    'file-model',
    'ui.bootstrap'
])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) {

        $stateProvider
            .state('editPost', {
                url: '/editPost',
                cache: false,
                templateUrl: 'app/editPost/views/editPost.html'
            });
        $locationProvider.html5Mode(true);
    });


