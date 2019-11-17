angular.module('blogPost').factory('blogPostService', ['$http', '$q', function ($http, $q) {
    var service = {
        getBlogData: getBlogData,
        getAllBlogData: getAllBlogData
        /*getAllUsersProfileDetails: getAllUsersProfileDetails*/
    };
    return service;


    function getBlogData(id) {
        var deferred = $q.defer();
        $http.get('/myBlog', {params: {id: id}}).then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }


    function getAllBlogData() {
        var deferred = $q.defer();
        $http.get('/all/blog').then(function (response) {
            deferred.resolve(response || {});
        });
        return deferred.promise;
    }

}]);
