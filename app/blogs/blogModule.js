angular.module('myBlog', [
    'ui.router',
    'toastr',
    'file-model',
    'ui.bootstrap'
])
    .config(function($stateProvider,$urlRouterProvider,$locationProvider) {

        $stateProvider
            .state('myBlogs', {
                url: '/myBlogs',
                cache: false,
                templateUrl: 'app/blogs/views/myBlogs.html',
                controller:'blogsCtrl'
            });
        $locationProvider.html5Mode(true);
    });


